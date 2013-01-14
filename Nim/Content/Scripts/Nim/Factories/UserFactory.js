/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/Models/User"], function ($, _, Backbone, Marionette, User) {
    return {
        create: function (name, playerId) {
            var user = new User({
                name: name,
                playerId: playerId
            });

            return user;
        }, 
        createDTO: function (user) {
            return {
                Name: user.get("name"),
                PlayerId: user.get("playerId")
            };
        }
    };
});