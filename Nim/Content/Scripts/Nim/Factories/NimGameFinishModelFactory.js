/// <reference path="../docs.js" />

define(["Underscore", "Nim/Factories/Factory", "Nim/Factories/PlayerScoreModelFactory", "Nim/Models/NimGameFinishModel", "Nim/Factories/PlayerModelFactory"], function (_, Factory, PlayerScoreModelFactory, NimGameFinishModel, PlayerModelFactory) {

    var REQUIRED_PROPERTIES = [
        "Scores",
        "Winner"
    ];

    return Factory.extend({
        create: function (nimGameFinish) {
            //Check if the game is valid
            if (_.validateProperties(nimGameFinish, REQUIRED_PROPERTIES) === false) {
                throw new Error("nimGameFinish could not be validated");
            }

            var model = new NimGameFinishModel({
                "scores": PlayerScoreModelFactory.createMultiple(nimGameFinish.Scores),
                "winner": PlayerModelFactory.create(nimGameFinish.Winner)
            });

            return model;
        }
    });
});