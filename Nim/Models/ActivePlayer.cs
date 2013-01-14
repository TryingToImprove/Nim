using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Nim.Models
{
    public class ActivePlayer : Player
    {
        public Game Game { get; set; }
    }
}