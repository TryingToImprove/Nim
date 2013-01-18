using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Nim.Models
{
    public class PlayerScore
    {
        public Player Player { get; set; }
        public int Wins { get; set; }
        public int Loses { get; set; }
    }
}
