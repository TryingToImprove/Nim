/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/IdleView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        className: "modal hide yellow-modal waiting-modal",
        attributes: {
            "data-backdrop": "static"
        }
    });

    return View;
});