﻿/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette"], function ($, _, Backbone, Marionette) {
    var Model = Backbone.Model.extend({
        defaults: {
            "playerId": null,
            "connectionId": null,
            "name": null
        }
    });

    return Model;
});
