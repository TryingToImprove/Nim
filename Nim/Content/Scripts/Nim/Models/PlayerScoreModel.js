/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette"], function ($, _, Backbone, Marionette) {
    var Model = Backbone.Model.extend({
        defaults: {
            "player": null,
            "wins": null,
            "loses": null,
            "state": 0
        }
    });

    return Model;
});
