/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/SearchingForOpponentView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        className: "content-container inverse"
    });

    return View;
});