using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Nim.Models.DTO
{
    public class GameDTO
    {
        public Guid GameId { get; set; }
        public List<ActivePlayer> Players { get; set; }
        public List<NimGameResult> GameResults { get; set; }
        public NimGame ActiveGame { get; set; }
        public Player CurrentTurn { get; set; }
    }
}