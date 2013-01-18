using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.AspNet.SignalR.Hubs;
using Nim.Hubs;
using Microsoft.AspNet.SignalR;
using Nim.Factories;
using Nim.Adaptors;

namespace Nim.Models
{
    public class NimGame
    {
        private List<NimGameAction> actions = new List<NimGameAction>();
        private readonly int numberOfLines;
        private Game game;

        public List<NimGameAction> Actions
        {
            get
            {
                return actions;
            }
        }
        public Game Game { get { return game; } }
        public int Crossed { get; set; }
        public int NumberOfLines { get { return numberOfLines; } }

        public NimGame(int numberOfLines)
        {
            this.numberOfLines = numberOfLines;
        }

        public static NimGame Create(Game game)
        {
            //TODO: Random again
            int numberOfLines = 2; // new Random().Next(10, 20);

            return new NimGame(numberOfLines)
            {
                game = game
            };
        }

        public void Begin()
        {
            //Load clients from gameHub
            IHubContext clients = GetClients();

            string eventName = (this.Game.GameResults.Count > 0) ? "server:play:start:again" : "game:start";

            //Notify all players that we start a new game
            game.Players.ForEach(x =>
            {
                clients.Clients.Client(x.Connection.ConnectionId).Publish(eventName, JsonHelper.SerializeObject(game));
            });
        }

        private void NotifyCrossOut(int sum)
        {
            //Load clients from gameHub
            IHubContext clients = GetClients();

            //Notify all players that we start a new game
            game.Players.ForEach(x =>
            {
                clients.Clients.Client(x.Connection.ConnectionId).Publish("server:crossOut", sum, JsonHelper.SerializeObject(game));
            });
        }

        private void NotifyWinner(Player winner, int sum)
        {
            //Load clients from gameHub
            IHubContext clients = GetClients();

            NimGameFinish nimGameFinish = new NimGameFinish(game);

            //Notify all players that we start a new game
            game.Players.ForEach(x =>
            {
                clients.Clients.Client(x.Connection.ConnectionId).Publish("server:finish", JsonHelper.SerializeObject(nimGameFinish), sum, JsonHelper.SerializeObject(game));
            });

            //TODO: Remove game?
        }

        private static IHubContext GetClients()
        {
            IHubContext clients = GlobalHost.ConnectionManager.GetHubContext<GameHub>();
            return clients;
        }

        public void RequestCrossOut(int sum)
        {
            bool notifyCrossOut = false,
                 notifyWinner = false;

            if (this.Crossed + sum < this.NumberOfLines)
            {
                //Increment the number of crossed lines
                this.Crossed += sum;

                //Add the game actions
                this.actions.Add(new NimGameAction()
                {
                    Cross = sum,
                    Player = game.CurrentTurn
                });
                
                //Check if all lines are crossed..
                if (this.Crossed == this.numberOfLines - 1 || this.Crossed >= this.numberOfLines)
                {
                    //Save the result of the game
                    game.GameResults.Add(new NimGameResult(this.actions, game.CurrentTurn));

                    //If they are then notify winne
                    this.NotifyWinner(game.CurrentTurn, sum);

                    //Change the turn
                    game.ChangeTurn();
                }
                else
                {
                    //Change the turn
                    game.ChangeTurn();

                    //Notify the players
                    this.NotifyCrossOut(sum);
                }
            }
        }
    }
}
