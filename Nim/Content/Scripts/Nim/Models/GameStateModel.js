/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette"], function ($, _, Backbone, Marionette) {
    var Model = Backbone.Model.extend({
        defaults: {
            "currentState": null
        },
        initialize: function () {
        },
        is: function (state) {
            return this.get("currentState") === state;
        }
    });

    return Model;
});
