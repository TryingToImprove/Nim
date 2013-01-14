using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Nim.Models
{
    public class NimGameResult
    {
        private readonly List<NimGameAction> actions;
        private readonly Player winner;

        public List<NimGameAction> Actions
        {
            get
            {
                return actions;
            }
        }
        public Player Winner
        {
            get
            {
                return winner;
            }
        }

        public NimGameResult(List<NimGameAction> actions, Player winner)
        {
            this.winner = winner;
            this.actions = actions;
        }
    }
}