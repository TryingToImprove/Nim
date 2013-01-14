using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nim.Domain;

namespace Nim.Models
{
    public abstract class Player
    {
        public string PlayerId { get; set; }
        public IConnection Connection { get; set; }

        public string Name { get; set; }
    }
}
