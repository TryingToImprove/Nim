/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "Nim/Views/GameLayout", "Nim/Views/CanvasView", "Nim/Views/CommandView", "Nim/Views/IdleView"], function ($, _, Backbone, Marionette, app, GameLayout, CanvasView, CommandView, IdleView) {

    var CanvasViewModel = Backbone.Model.extend({
    });

    var Turn = {
        OPPONENT: 0,
        YOU: 1
    };

    var Controller = {
        layout: new GameLayout(),
        canvasView: null,
        commandView: null,
        currentTurn: "",
        start: function (game, hub) {
            this.game = game;
            this.hub = hub;

            console.log(this.game);

            app.content.show(this.layout);

            this.turnManager(game.CurrentTurn);

            this.canvasView = new CanvasView({
                LINES_LENGTH: this.game.ActiveGame.NumberOfLines,
                controller: this,
                model: new CanvasViewModel({
                    lines: createLinesArray(this.game.ActiveGame.NumberOfLines)
                })
            });

            this.layout.canvas.show(this.canvasView);

            return this;
        },
        turnManager: function (currentTurn) {
            if (currentTurn.PlayerId === app.user.get("playerId")) { //Users turns

                this.commandView = new CommandView({
                    controller: this
                });

                this.layout.command.show(this.commandView);

            } else { //Opponant turns
                this.layout.command.show(new IdleView());
            }

            this.currentTurn = currentTurn;
        },
        requestCrossOut: function (sum) {
            this.hub.server.requestCrossOut(this.game.GameId, sum);
        },
        crossOut: function (sum, game) {
            this.turnManager(game.CurrentTurn);

            this.canvasView.crossOut(sum);

            return this.canvasView.getLinesLeft();
        },
        finish: function (winner, game) {
            console.log(game);

            var that = this;

            require(["Nim/Models/FinishModel", "Nim/Views/FinishView"], function (FinishModel, FinishView) {
                var model = new FinishModel({ you: (winner === app.user.get("playerId")) });

                that.layout.command.show(new FinishView({ model: model, controller: that }));
            });
        },
        playAgain: function () {
            this.hub.server.requestSpecificGame(this.game.GameId, app.user.get("playerId"));
        }
    };

    function createLinesArray(linesCount) {
        var lines = [];

        for (var i = 0; i < linesCount; i += 1) {
            lines.push({});
        }

        return lines;
    }

    return Controller;
});