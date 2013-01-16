/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "Nim/Views/StatusView", "text!Templates/LoginLayout.html", "text!Templates/LoginView.html"], function ($, _, Backbone, Marionette, app, StatusView, layoutTemplate, viewTemplate) {

    var Layout = Backbone.Marionette.Layout.extend({
        template: layoutTemplate,
        regions: {
            "form": "#loginView-form",
            "status": "#loginView-status"
        },
        onShow: function () {
            this.form.show(new View());
            this.status.show(new StatusView());
        }
    }),
        View = Backbone.Marionette.ItemView.extend({
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

    return Layout;
});