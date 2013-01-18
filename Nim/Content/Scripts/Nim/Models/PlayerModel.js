/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette"], function ($, _, Backbone, Marionette) {
    var Model = Backbone.Model.extend({
        defaults: {
            "playerId": null,
            "connectionId": null,
            "name": null
        },
        validate: function (attrs, options) {
            _.each(attrs, function (value, key) {
                if (!this.defaults.hasOwnProperty(key)) {
                    throw new Error(key + " was not found!!");
                }
            }, this);
        }
    });

    return Model;
});
