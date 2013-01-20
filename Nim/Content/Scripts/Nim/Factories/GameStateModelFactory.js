/// <reference path="../docs.js" />

define(["Underscore", "Nim/Factories/Factory", "Nim/Models/GameStateModel"], function (_, Factory, GameStateModel) {

    var REQUIRED_PROPERTIES = [
        "CurrentState"
    ];

    return Factory.extend({
        create: function (gameState) {
            //Check if the game is valid
            if (_.validateProperties(gameState, REQUIRED_PROPERTIES) === false) {
                throw new Error("GameState could not be validated");
            }

            var model = new GameStateModel({
                "currentState": gameState.CurrentState
            });

            return model;
        }
    });
});
