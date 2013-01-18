/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette"], function ($, _, Backbone, Marionette) {
    var Model = Backbone.Model.extend({
        defaults: {
            "gameId": null,
            "players": [],
            "gameResults": [],
            "activeGame": null,
            "currentTurn": null
        },
        initialize: function () {
        }
    });

    return Model;
});
