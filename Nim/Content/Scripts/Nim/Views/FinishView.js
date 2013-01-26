/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/FinishView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {
    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        attributes: {
            "data-backdrop": "static"
        },
        className: "modal hide fade",
        canRestart: true,
        initialize: function (options) {
            options = options || {};

            this.controller = options.controller;

            //Listen to player replay
            this.listenTo(app, "server:play:user:joined:again", function (playerId, game) {

                _.each(this.model.get("scores"), function (score) {
                    if (score.get("player").get("playerId") === playerId) {
                        score.set("state", {
                            "cssClass": "willPlayAgain",
                            "message": "(waiting for you...)"
                        });
                    }
                });

                this.render();
            });

            //Listen to player replay
            this.listenTo(app, "server:player:disconnect", function (player, game) {

                var renderViewFunc = this.render,
                    scores = this.model.get("scores"),
                    view = this;

                this.canRestart = false;

                require(["Nim/Factories/PlayerModelFactory"], function (PlayerModelFactory) {
                    player = PlayerModelFactory.create(player);

                    _.each(scores, function (score) {
                        if (score.get("player").get("playerId") === player.get("playerId")) {
                            score.set("state", {
                                "cssClass": "disconnected",
                                "message": "(have disconnected)"
                            });
                        }
                    });


                    //renderViewFunc causes all states to fuck up!
                    renderViewFunc();

                    $(".restart", view.$el).attr("disabled", "disabled")
                        .addClass("btn-danger")
                        .removeClass("btn-primary")
                        .removeClass("restart")
                        .text("A player have leaved, so you can't try again..");
                });
            });
        },
        ui: {
            btnPlayAgain: ".restart"
        },
        events: {
            "click .restart": "restart"
        },
        restart: function (e) {
            if (this.canRestart) {
                this.controller.playAgain();

                this.canRestart = false;

                this.ui.btnPlayAgain.removeClass("btn-primary")
                .removeClass("restart")
                .addClass("btn-success")
                .attr("disabled", "disabled")
                .text("Waiting for the other player..");
            }
        }
    });

    return View;
});