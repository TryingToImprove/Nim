using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR.Hubs;

namespace Nim.Hubs
{
    [HubName("game")]
    public class GameHub : Hub
    {
        public static List<IdleGamer> IdleGamers = new List<IdleGamer>();
        public static List<Game> Games = new List<Game>();

        public void requestGame(string name)
        {
            IdleGamers.Add(new IdleGamer()
            {
                Name = name,
                Caller = Clients.Caller
            });

            if (IdleGamers.Count > 1)
            {
                Game game = new Game();
                game.Name1 = IdleGamers.ElementAt(0);
                game.Name2 = IdleGamers.ElementAt(1);
                game.Crossed = 0;
                game.CurrentTurn = game.Name1.Name;

                game.Name1.Caller.startGame(game);
                game.Name2.Caller.startGame(game);

                Games.Add(game);

                IdleGamers.RemoveRange(0, 2);
            }
        }

        public void requestCrossOut(Guid gameId, int sum)
        {
            Game game = Games.Find(x => x.GameId == gameId);

            if (sum + game.Crossed < game.Lines)
            {
                game.Crossed += sum;
                game.ChangeTurn();

                game.Name1.Caller.responseCrossOut(sum, game);
                game.Name2.Caller.responseCrossOut(sum, game);
            }

            if (game.Crossed == game.Lines - 1 || game.Crossed >= game.Lines)
            {
                if (game.CurrentTurn == game.Name1.Name)
                {
                    game.Name1.Caller.responseGameEnd(game.Name1.Name, game);
                    game.Name2.Caller.responseGameEnd(game.Name1.Name, game);
                }
                else
                {
                    game.Name1.Caller.responseGameEnd(game.Name2.Name, game);
                    game.Name2.Caller.responseGameEnd(game.Name2.Name, game);
                }

                Games.Remove(game);
            }


        }
    }

    public class IdleGamer
    {
        public string Name { get; set; }
        public dynamic Caller { get; set; }
    }

    public class Game
    {
        public const int NUMBER_OF_LINES = 10;

        public Guid GameId { get; set; }
        public IdleGamer Name1 { get; set; }
        public IdleGamer Name2 { get; set; }
        public int Lines { get { return NUMBER_OF_LINES; } }

        public string CurrentTurn { get; set; }
        public string Other
        {
            get
            {
                if (CurrentTurn == Name1.Name)
                {
                    return Name2.Name;
                }
                else
                {
                    return Name1.Name;
                }
            }
        }
        public int Crossed { get; set; }

        public Game()
        {
            this.GameId = Guid.NewGuid();
        }

        public void ChangeTurn()
        {
            if (CurrentTurn == Name1.Name)
            {
                CurrentTurn = Name2.Name;
            }
            else
            {
                CurrentTurn = Name1.Name;
            }
        }


    }
}