/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/Models/PlayerModel"], function ($, _, Backbone, Marionette, PlayerModel) {

    var REQUIRED_PROPERTIES = [
        "PlayerId",
        "Connection",
        "Name"
    ];

    return {
        create: function (player) {
            //Make sure the player is valid!
            if (_.validateProperties(player, REQUIRED_PROPERTIES) === false) {
                throw new Error("Player could not be validated");
            }

            //create the player
            var createdPlayer = new PlayerModel({
                "playerId": player.PlayerId,
                "name": player.Name,
                "connectionId": player.Connection.ConnectionId
            });

            return createdPlayer;
        },
        createMultiple: function (players) {
            var createdPlayers = [],
                createFunc = this.create; //save reference to the create function

            //Loop over the players and push the created player to the createdPlayers array.
            _.each(players, function (player) {
                createdPlayers.push(createFunc(player));
            });

            return createdPlayers;
        },
        toJSON: function (player) {
            return {
                "PlayerId": player.get("playerId"),
                "Connection": {
                    "ConnectionId": player.get("connectionId")
                },
                "Name": player.get("name")
            };
        }
    };
});
