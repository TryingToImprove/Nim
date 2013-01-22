/// <reference path="../docs.js" />

define(["Underscore", "Backbone"], function (_, Backbone) {
    "use strict";

    var Model = Backbone.Model.extend({
        defaults: {
            sum: null,
            text: null
        },
        initialize: function (attrs, options) {
        }
    });

    return Model;
});