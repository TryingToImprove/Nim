using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR.Hubs;
using Nim.Hubs;
using Microsoft.AspNet.SignalR;

namespace Nim.Models
{
    public class Game
    {
        private List<ActivePlayer> players = new List<ActivePlayer>();
        private List<NimGameResult> gameResults = new List<NimGameResult>();
        private NimGame activeGame;
        private readonly Guid gameId;
        private int currentTurn;
        private int userJoined = 0;

        public Guid GameId { get { return gameId; } }
        public List<ActivePlayer> Players
        {
            get
            {
                return players;
            }
        }
        public List<NimGameResult> GameResults
        {
            get
            {
                return gameResults;
            }
        }
        public NimGame ActiveGame
        {
            get
            {
                return activeGame;
            }
        }
        public Player CurrentTurn { get { return Players[currentTurn % Players.Count]; } }

        public Game()
        {
            this.gameId = Guid.NewGuid();
        }

        public void StartNew()
        {
            //Create a new game
            activeGame = NimGame.Create(this);

            //Begin game!
            activeGame.Begin();
        }

        public void ChangeTurn()
        {
            //We need to check if currentTurn is the same as maxValue, because if it is, then we need to prevent a error (Not likey this will happen)
            if (int.MaxValue == this.currentTurn)
            {
                currentTurn = int.MaxValue % this.players.Count;
            }
            else //Otherwise we just increment the turn
            {
                this.currentTurn += 1;
            }
        }

        public void AddPlayer(ActivePlayer player)
        {
            //Save a reference to the game
            player.Game = this;

            //Add the player
            this.players.Add(player);
        }

        public void UserJoined(string playerId)
        {
            //Increment the users joined
            userJoined += 1;

            //Check if all the players have joined
            if (userJoined == this.Players.Count)
            {
                //reset userJoined, so we can play more than 2 times.
                userJoined = 0;

                //Start a new game
                this.StartNew();
            }
        }
    }
}