using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR.Hubs;
using Nim.Models;
using Nim.Factories;
using Nim.Models.DTO;
using System.Threading.Tasks;

namespace Nim.Hubs
{
    [HubName("game")]
    public class GameHub : Hub
    {
        public static List<IdlePlayer> IdlePlayers = new List<IdlePlayer>();
        public static List<Game> Games = new List<Game>();

        public void requestGame(PlayerDTO playerDTO)
        {
            IdlePlayers.Add(new IdlePlayer()
            {
                PlayerId = playerDTO.PlayerId,
                Name = playerDTO.Name,
                Connection = new Connection(Context.ConnectionId)
            });

            if (IdlePlayers.Count > 1)
            {
                Game game = new Game();
                game.AddPlayer(PlayerFactory.Create(IdlePlayers[0]));
                game.AddPlayer(PlayerFactory.Create(IdlePlayers[1]));

                Games.Add(game);

                //Start a game... 
                game.StartNew();

                IdlePlayers.RemoveRange(0, 2);
            }
        }

        public void requestSpecificGame(Guid gameId, string playerId)
        {
            Games
                .Find(x => x.GameId == gameId)
                .UserJoined(playerId);
        }

        public void requestCrossOut(Guid gameId, int sum)
        {
            Games
                .Find(x => x.GameId == gameId)
                .ActiveGame
                .RequestCrossOut(sum);
        }

        public override Task OnDisconnected()
        {
            List<Game> gamesWhereUserIn = Games.Where(x => x.Players.Any(y => y.Connection.ConnectionId.Equals(Context.ConnectionId, StringComparison.InvariantCultureIgnoreCase))).ToList();

            gamesWhereUserIn.ForEach(x =>
            {
                x.PlayerDisconnected(Context.ConnectionId);
            });

            return base.OnDisconnected();
        }
    }
}