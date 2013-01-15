/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/PlayerDisconnectedView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        attributes: {
            "data-backdrop": "static"
        },
        className: "modal hide fade",
        events: {
            "click a[href='#requestNewGame']": "requestNewGame"
        },
        ui: {
            requestNewGame: "a[href='#requestNewGame']"
        },
        initialize: function (options) {
            options = options || {};

            this.controller = options.controller;
        },
        requestNewGame: function () {
            app.vent.trigger("game:request:new");

            this.ui.requestNewGame.text("Searching for opponent...").attr("disabled", "disabled");

            return false;
        }
    });

    return View;
});