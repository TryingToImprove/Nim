using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nim.Models.DTO;
using Nim.Models;

namespace Nim.Factories
{
    public class GameFactory
    {
        public static GameDTO CreateDTO(Game game)
        {
            GameDTO gameDTO = new GameDTO()
            {
                GameId = game.GameId,
                ActiveGame = game.ActiveGame,
                GameResults = game.GameResults,
                CurrentTurn = game.CurrentTurn,
                Players = game.Players
            };

            return gameDTO;
        }
    }
}