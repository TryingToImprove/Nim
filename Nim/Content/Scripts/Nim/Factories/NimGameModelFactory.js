/// <reference path="../docs.js" />

define(["Underscore", "Nim/Factories/Factory", "Nim/Models/NimGameModel"], function (_, Factory, NimGameModel) {

    var REQUIRED_PROPERTIES = [
        "Actions",
        "Crossed",
        "NumberOfLines"
    ];

    return Factory.extend({
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
        }
    });
});