/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "Nim/Views/GameLayout", "Nim/Views/CanvasView", "Nim/Views/CommandView", "Nim/Views/IdleView"], function ($, _, Backbone, Marionette, app, GameLayout, CanvasView, CommandView, IdleView) {
    var Controller = {
        layout: new GameLayout(),
        canvasView: null,
        commandView: null,
        currentTurn: "",
        start: function (game, hub) {
            app.content.show(this.layout);

            this.game = game;
            this.hub = hub;

            this.turnManager(game.CurrentTurn);

            this.canvasView = new CanvasView({
                LINES_LENGTH: this.game.Lines,
                controller: this
            });

            this.layout.canvas.show(this.canvasView);

            return this;
        },
        turnManager: function (gameCurrentTurn) {
            if (gameCurrentTurn === app.user.get("name")) {
                this.commandView = new CommandView({
                    controller: this
                });
                this.layout.command.show(this.commandView);
            } else {
                this.layout.command.show(new IdleView());
            }

            this.currentTurn = gameCurrentTurn;
        },
        requestCrossOut: function (sum) {
            this.hub.server.requestCrossOut(this.game.GameId, sum);
        },
        crossOut: function (sum, game) {
            this.turnManager(game.CurrentTurn);

            this.canvasView.crossOut(sum);

            return this.canvasView.getLinesLeft();
        },
        finish: function (loser, game) {
            var that = this;

            console.log(loser, app.user.get("name"));
            require(["Nim/Models/FinishModel", "Nim/Views/FinishView"], function (FinishModel, FinishView) {
                var model = new FinishModel({ you: (loser === app.user.get("name")) });

                that.layout.command.show(new FinishView({ model: model }));
            });
        }
    };

    return Controller;
});