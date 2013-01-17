using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR.Hubs;
using Nim.Models;
using Nim.Factories;
using Nim.Models.DTO;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

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
                Connection = new Nim.Models.Connection(Context.ConnectionId)
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

            PlayerCountChanged();
        }

        public void requestSpecificGame(Guid gameId)
        {
            Games
                .Find(x => x.GameId == gameId)
                .UserJoined(Context.ConnectionId);

            PlayerCountChanged();
        }

        public void requestCrossOut(Guid gameId, int sum)
        {
            Games
                .Find(x => x.GameId == gameId)
                .ActiveGame
                .RequestCrossOut(sum);
        }

        public override Task OnConnected()
        {
            PlayerCountChanged();

            return base.OnConnected();
        }

        private void PlayerCountChanged()
        {
            int activePlayers = Games.Sum(x => x.Players.Count),
                idlePlayers = IdlePlayers.Count,
                players = activePlayers + idlePlayers;

            Clients.All.Publish("server:players:count:changed", new
            {
                IdlePlayers = idlePlayers,
                ActivePlayers = activePlayers,
                Players = players
            }, Games.Count);
        }

        public override Task OnDisconnected()
        {
            List<Game> gamesWhereUserIn = Games.Where(x => x.Players.Any(y => y.Connection.ConnectionId.Equals(Context.ConnectionId, StringComparison.InvariantCultureIgnoreCase))).ToList();

            //Loop through the player and tell that this connection disconnected
            gamesWhereUserIn.ForEach(x =>
            {
                x.PlayerDisconnected(Context.ConnectionId);

                //We remove the game, cause it can never be started again
                Games.Remove(x);
            });

            //We also want to check if the player is idle, if he is then remove him!
            IdlePlayers.RemoveAll(x => x.Connection.ConnectionId.Equals(Context.ConnectionId, StringComparison.InvariantCultureIgnoreCase));

            PlayerCountChanged();

            return base.OnDisconnected();
        }
    }
}