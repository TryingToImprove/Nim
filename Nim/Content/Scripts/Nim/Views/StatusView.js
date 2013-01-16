/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "Nim/Models/StatusModel", "text!Templates/StatusView.html"], function ($, _, Backbone, Marionette, app, StatusModel, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        onShow: function () {
            this.listenTo(app, "server:players:count:changed", function (playerCount, gameCount) {
                this.model = new StatusModel({
                    idlePlayers: playerCount.IdlePlayers,
                    activePlayers: playerCount.ActivePlayers,
                    players: playerCount.Players,
                    gameCount: gameCount
                });

                this.render();
            });
        }
    });

    return View;
});