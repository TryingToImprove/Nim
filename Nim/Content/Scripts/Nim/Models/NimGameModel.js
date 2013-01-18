/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette"], function ($, _, Backbone, Marionette) {
    var Model = Backbone.Model.extend({
        defaults: {
            "actions": [],
            "crossed": 0,
            "numberOfLines": null
        }
    });

    return Model;
});
