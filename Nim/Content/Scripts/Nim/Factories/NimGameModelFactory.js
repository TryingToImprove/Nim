/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/Models/NimGameModel"], function ($, _, Backbone, Marionette, NimGameModel) {

    var REQUIRED_PROPERTIES = [
        "Actions",
        "Crossed",
        "NumberOfLines"
    ];

    return {
        create: function (nimGame) {
            //Check if the game is valid
            if (_.validateProperties(nimGame, REQUIRED_PROPERTIES) === false) {
                throw new Error("NimGame could not be validated");
            }

            var model = new NimGameModel({
                "actions": nimGame.Actions,
                "crossed": nimGame.Crossed,
                "numberOfLines": nimGame.NumberOfLines
            });

            return model;
        },
        createMultiple: function (nimGames) {
            var createdNimGames = [],
                createFunc = this.create; //save reference to the create function

            //Loop over the games and push the created game to the createdGames array.
            _.each(nimGames, function (nimGame) {
                createdNimGames.push(createdFunc(nimGame));
            });

            return createdNimGames;
        }
    };
});