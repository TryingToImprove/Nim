/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette"], function ($, _, Backbone, Marionette) {
    var Model = Backbone.Model.extend({
        strict: false
    });

    return Model;
});