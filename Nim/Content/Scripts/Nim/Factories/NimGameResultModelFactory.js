/// <reference path="../docs.js" />

define(["Underscore", "Nim/Factories/Factory", "Nim/Factories/NimGameActionModelFactory", "Nim/Models/NimGameResultModel", "Nim/Factories/PlayerModelFactory"], function (_, Factory, NimGameActionModelFactory, NimGameResultModel, PlayerModelFactory) {

    var REQUIRED_PROPERTIES = [
        "Actions",
        "Winner"
    ];

    return Factory.extend({
        create: function (nimGameResult) {
            //Check if the game is valid
            if (_.validateProperties(nimGameResult, REQUIRED_PROPERTIES) === false) {
                throw new Error("NimGameResultModel could not be validated");
            }

            var model = new NimGameResultModel({
                "actions": NimGameActionModelFactory.createMultiple(nimGameResult.Actions),
                "winner": PlayerModelFactory.create(nimGameResult.Winner)
            });

            return model;
        }
    });
});