/// <reference path="../docs.js" />

define(["Underscore", "Nim/Factories/Factory", "Nim/Models/NimGameActionModel", "Nim/Factories/PlayerModelFactory"], function (_, Factory, NimGameActionModel, PlayerModelFactory) {

    var REQUIRED_PROPERTIES = [
        "Cross",
        "Player"
    ];

    return Factory.extend({
        create: function (nimGameAction) {
            //Check if the game is valid
            if (_.validateProperties(nimGameAction, REQUIRED_PROPERTIES) === false) {
                throw new Error("NimGameAction could not be validated");
            }

            var model = new NimGameActionModel({
                "cross": nimGameAction.Cross,
                "player": PlayerModelFactory.create(nimGameAction.Player)
            });

            return model;
        }
    });
});