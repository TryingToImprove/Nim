/// <reference path="../docs.js" />

define(["Underscore", "Nim/Factories/Factory", "Nim/Models/PlayerScoreModel"], function (_, Factory, PlayerScoreModel) {

    var REQUIRED_PROPERTIES = [
        "Player",
        "Wins",
        "Loses"
    ];

    return Factory.extend({
        create: function (playerScore) {
            //Make sure the player is valid!
            if (_.validateProperties(playerScore, REQUIRED_PROPERTIES) === false) {
                throw new Error("playerScore could not be validated");
            }

            //create the player
            var createdPlayer = new PlayerScoreModel({
                "player": playerScore.Player,
                "wins": playerScore.Wins,
                "loses": playerScore.Loses
            });

            return createdPlayer;
        }
    });
});
