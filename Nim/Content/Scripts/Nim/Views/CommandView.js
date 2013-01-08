/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/CommandView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        className: "commands",
        events: {
            "click .btn": "crossOut"
        },
        initialize: function (options) {
            options = options || {}
            this.controller = options.controller || null;
        },
        crossOut: function (e) {
            var target = $(e.currentTarget);

            this.controller.requestCrossOut(target.data("sum"));
        }
    });

    return View;
});