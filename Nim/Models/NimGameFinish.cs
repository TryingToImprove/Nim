using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Nim.Models
{
    public class NimGameFinish
    {
        public Player Winner { get; set; }
        public List<PlayerScore> Scores { get; set; }

        public NimGameFinish(Game game)
        {
            var scores = new List<PlayerScore>();

            foreach (ActivePlayer player in game.Players)
            {
                scores.Add(new PlayerScore()
                {
                    Player = player,
                    Wins = game.GameResults.Count(x => x.Winner == player),
                    Loses = game.GameResults.Count(x => x.Winner != player)
                });
            }

            this.Scores = scores;
            this.Winner = game.GameResults.Last().Winner;
        }
    }
}