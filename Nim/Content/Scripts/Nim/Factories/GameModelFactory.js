/// <reference path="../docs.js" />

define(["Underscore", "Nim/Factories/Factory", "Nim/Models/GameModel", "Nim/Factories/PlayerModelFactory", "Nim/Factories/NimGameModelFactory", "Nim/Factories/NimGameResultModelFactory"], function (_, Factory, GameModel, PlayerFactory, NimGameFactory, NimGameResultFactory) {

    var REQUIRED_PROPERTIES = [
        "GameId",
        "Players",
        "GameResults",
        "ActiveGame",
        "CurrentTurn"
    ];

    return Factory.extend({
        create: function (game) {
            //Check if the game is valid
            if (_.validateProperties(game, REQUIRED_PROPERTIES) === false) {
                console.log(game);
                throw new Error("Game could not be validated");
            }

            console.log(game);

            var players = PlayerFactory.createMultiple(game.Players), //Create the players
            //Search though the players to find the currentTurn player, by playerId
            currentTurn = _.find(players, function (player) {
                return player.get("playerId") === game.CurrentTurn.PlayerId
            }),
            //Create the activeGame
            activeGame = NimGameFactory.create(game.ActiveGame),
            //Create the game results
            gameResults = NimGameResultFactory.createMultiple(game.GameResults);

            var model = new GameModel({
                "gameId": game.GameId,
                "players": players,
                "gameResults": gameResults,
                "activeGame": activeGame,
                "currentTurn": currentTurn
            });

            return model;
        }
    });
});
