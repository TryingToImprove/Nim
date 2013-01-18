/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "Nim/ViewModels/StatusViewModel", "text!Templates/StatusView.html"], function ($, _, Backbone, Marionette, app, StatusViewModel, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        onShow: function () {
            this.listenTo(app, "server:players:count:changed", function (playerCount, gameCount) {
                this.model = new StatusViewModel({
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