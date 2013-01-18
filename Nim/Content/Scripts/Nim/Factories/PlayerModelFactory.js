/// <reference path="../docs.js" />

define(["Underscore", "Nim/Factories/Factory", "Nim/Models/PlayerModel"], function (_, Factory, PlayerModel) {

    var REQUIRED_PROPERTIES = [
        "PlayerId",
        "Connection",
        "Name"
    ];

    return Factory.extend({
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
        toJSON: function (player) {
            return {
                "PlayerId": player.get("playerId"),
                "Connection": {
                    "ConnectionId": player.get("connectionId")
                },
                "Name": player.get("name")
            };
        }
    });
});
