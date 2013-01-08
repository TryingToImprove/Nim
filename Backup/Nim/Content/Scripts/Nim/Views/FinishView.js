/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/FinishView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        events: {
            "click .restart": "restart"
        },
        restart: function(){
            app.vent.trigger("game:idle");
        }
    });

    return View;
});