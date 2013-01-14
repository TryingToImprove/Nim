using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nim.Models;

namespace Nim.Factories
{
    public class PlayerFactory
    {
        public static ActivePlayer Create(IdlePlayer idlePlayer)
        {
            ActivePlayer activePlayer = new ActivePlayer();
            activePlayer.Connection = idlePlayer.Connection;
            activePlayer.Name = idlePlayer.Name;
            activePlayer.PlayerId = idlePlayer.PlayerId;

            return activePlayer;
        }
    }
}