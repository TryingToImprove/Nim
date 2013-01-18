/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/Models/GameModel", "Nim/Factories/PlayerModelFactory", "Nim/Factories/NimGameModelFactory"], function ($, _, Backbone, Marionette, GameModel, PlayerFactory, NimGameFactory) {

    var REQUIRED_PROPERTIES = [
        "GameId",
        "Players",
        "GameResults",
        "ActiveGame",
        "CurrentTurn"
    ];

    return {
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
            activeGame = NimGameFactory.create(game.ActiveGame);

            var model = new GameModel({
                "gameId": game.GameId,
                "players": players,
                "gameResults": game.GameResults,
                "activeGame": activeGame,
                "currentTurn": currentTurn
            });

            return model;
        },
        createMultiple: function (games) {
            var createdGames = [],
                createFunc = this.create; //save reference to the create function

            //Loop over the games and push the created game to the createdGames array.
            _.each(games, function (game) {
                createdGames.push(createdFunc(game));
            });

            return createdGames;
        }
    };
});
