/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/LoginView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var StateModel = Backbone.Model.extend({})

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        tagName: "form",
        className: "form-signin",
        onShow: function () {
            this.listenTo(app, "server:players:count:changed", function (playerCount, gameCount) {

                this.model = new StateModel({
                    idlePlayers: playerCount.IdlePlayers,
                    activePlayers: playerCount.ActivePlayers,
                    players: playerCount.Players,
                    gameCount: gameCount
                });

                this.render();

            });
        },
        events: {
            "submit": "signIn"
        },
        ui: {
            txtName: "input[name='name']",
            lblIdlePlayer: "#loginView-idlePlayers"
        },
        signIn: function (e) {
            app.vent.trigger("user:authenticate", this.ui.txtName.val());

            return false;
        }
    });

    return View;
});