using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nim.Domain;

namespace Nim.Models
{
    public class Connection : IConnection
    {
        private readonly string connectionId;

        public string ConnectionId
        {
            get
            {
                return connectionId;
            }
        }

        public Connection(string connectionId)
        {
            this.connectionId = connectionId;
        }
    }
}