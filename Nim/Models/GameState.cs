using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nim.Domain;

namespace Nim.Models
{
    public class GameState
    {
        private GameStates currentState;

        public GameState(GameStates state)
        {
            this.currentState = state;
        }

        public int CurrentState
        {
            get
            {
                return (int)currentState;
            }
        }

        public void ChangeState(GameStates state)
        {
            currentState = state;
        }
    }
}
