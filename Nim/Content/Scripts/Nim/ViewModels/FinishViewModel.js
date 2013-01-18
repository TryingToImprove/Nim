/// <reference path="../docs.js" />

define(["Underscore", "Backbone"], function (_, Backbone) {
    "use strict";

    var Model = Backbone.Model.extend({
        defaults: {
            scores: [],
            winner: [],
            you: false,
            currentPlayer: null
        },
        initialize: function (attrs, options) {
            if (attrs.winner.get("playerId") === attrs.currentPlayer.get("playerId")) {
                this.set("you", true);
            }
        }
    });

    return Model;
});