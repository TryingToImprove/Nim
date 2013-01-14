using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Nim.Models
{
    public class IdlePlayer : Player
    {
        public TimeSpan IdleSince { get; set; }
    }
}