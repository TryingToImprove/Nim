/// <reference path="../docs.js" />

define(["Underscore", "Backbone"], function (_, Backbone) {
    "use strict";

    var Model = Backbone.Model.extend({
        strict:false,
        initialize: function () {
        }
    });

    return Model;
});