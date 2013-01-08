/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/LoginView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        tagName: "form",
        className: "form-signin",
        events: {
            "submit": "signIn"
        },
        ui: {
            txtName: "input[name='name']"
        },
        signIn: function (e) {
            app.vent.trigger("user:authenticate", this.ui.txtName.val());

            return false;
        }
    });

    return View;
});