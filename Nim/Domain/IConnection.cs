using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Nim.Domain
{
    public interface IConnection
    {
        string ConnectionId { get; }
    }
}
