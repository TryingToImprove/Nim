/// <reference path="../docs.js" />

define(["Underscore", "Backbone"], function (_, Backbone) {
    "use strict";

    var Model = Backbone.Model.extend({
        defaults: {
            "idlePlayers": 0,
            "activePlayers": 0,
            "players": 0,
            "gameCount": 0
        }
    });

    return Model;
});