/// <reference path="../docs.js" />

define(["Underscore", "Nim/Factories/Factory", "Nim/Models/GameModel", "Nim/Factories/PlayerModelFactory", "Nim/Factories/NimGameModelFactory", "Nim/Factories/NimGameResultModelFactory", "Nim/Factories/GameStateModelFactory"], function (_, Factory, GameModel, PlayerFactory, NimGameFactory, NimGameResultFactory, GameStateModelFactory) {

    var REQUIRED_PROPERTIES = [
        "GameId",
        "Players",
        "GameResults",
        "ActiveGame",
        "CurrentTurn",
        "CurrentState"
    ];

    return Factory.extend({
        create: function (game) {
            //Check if the game is valid
            if (_.validateProperties(game, REQUIRED_PROPERTIES) === false) {
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
            gameResults = NimGameResultFactory.createMultiple(game.GameResults),
            //Create a currentState model
            currentState = GameStateModelFactory.create(game.CurrentState);

            var model = new GameModel({
                "gameId": game.GameId,
                "players": players,
                "gameResults": gameResults,
                "activeGame": activeGame,
                "currentTurn": currentTurn,
                "currentState": currentState
            });

            console.log(model);

            return model;
        }
    });
});
