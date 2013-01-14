/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/FinishView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        initialize: function (options) {
            options = options || {};

            this.controller = options.controller;
        },
        events: {
            "click .restart": "restart"
        },
        restart: function () {
            this.controller.playAgain();
        }
    });

    return View;
});