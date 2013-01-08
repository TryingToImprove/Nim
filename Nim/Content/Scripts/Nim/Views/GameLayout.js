/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/GameLayout.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {
    var Layout = Backbone.Marionette.Layout.extend({
        template: viewTemplate,
        regions: {
            canvas: ".canvas-holder",
            command: ".commands-holder"
        }   
    });

    return Layout;
});