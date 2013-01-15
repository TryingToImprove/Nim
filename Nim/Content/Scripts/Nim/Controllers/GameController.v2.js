/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "Nim/Views/GameLayout"], function ($, _, Backbone, Marionette, app, GameLayout) {
    var CanvasViewModel = Backbone.Model.extend({
    });

    var gameController, GameController = Backbone.Marionette.Controller.extend({
        //Properties
        game: null,
        layout: null,

        //Constructor
        initialize: function () {
            this.layout = new GameLayout();
        },

        //Methods
        start: function (game) {
            var gameController = this;

            //Westart by syncing the gameController
            this.sync(game);

            //Display the layout
            app.content.show(this.layout);

            //Display the canvas
            require(["Nim/Views/CanvasView"], function (CanvasView) {
                gameController.layout.canvas.show(new CanvasView({
                    numberOfLines: gameController.game.ActiveGame.NumberOfLines,
                    controller: gameController,
                    model: new CanvasViewModel({
                        lines: createLinesArray(gameController.game.ActiveGame.NumberOfLines)
                    })
                }));
            });


            this.switchTurn();
        },
        sync: function (game) {
            //Should be call every time a callback from the server comes

            this.game = game;
        },
        crossOut: function (sum) {
            // Send a message to the server about the sum of lines to cross out
            app.gameHub.server.requestCrossOut(this.game.GameId, sum);
        },
        playAgain: function () { //When a user want to play again with the opponets
            // Tell the server that this player wants to play again

            //TODO: Use the factory, and send the player instead
            app.gameHub.server.requestSpecificGame(this.game.GameId, app.user.get("playerId"));
        },
        finish: function (winner) {
            var gameController = this;

            require(["Nim/Models/FinishModel", "Nim/Views/FinishView"], function (FinishModel, FinishView) {
                //Create a finish view
                var finishView = new FinishView({
                    model: new FinishModel({
                        you: (winner === app.user.get("playerId")) //TODO: BETTER
                    }),
                    controller: gameController
                });

                //Display the finish view as a modal
                gameController.layout.modal.show(finishView);

            });
        },
        playerDisconnected: function () {
            var gameController = this;

            require(["Nim/Views/PlayerDisconnectedView"], function (PlayerDisconnectedView) {

                //Create a finish view
                var playerDisconnectedView = new PlayerDisconnectedView({
                    controller: gameController
                });

                //Display the finish view as a modal
                gameController.layout.modal.show(playerDisconnectedView);

            });
        },
        switchTurn: function () {
            var gameController = this;

            if (this.game.CurrentTurn.PlayerId === app.user.get("playerId")) {
                //Close the waiting modal
                gameController.layout.modal.close();

                require(["Nim/Views/CommandView"], function (CommandView) {
                    var commandView = new CommandView({
                        controller: gameController
                    });

                    gameController.layout.command.show(commandView);
                });
            } else {
                //Close the buttons
                gameController.layout.command.close();

                require(["Nim/Views/IdleView"], function (IdleView) {
                    //Display the waiting modal
                    gameController.layout.modal.show(new IdleView());
                });
            }
        }
    });

    gameController = new GameController();

    gameController.listenTo(gameController, "server:crossOut", function (sum, game) {
        this.sync(game);

        //Trigger switch turn
        this.switchTurn();
    });

    gameController.listenTo(gameController, "server:finish", function (winner, game) {
        this.sync(game);

        //Trigger finish
        this.finish(winner);
    });

    gameController.listenTo(gameController, "server:player:disconnect", function (player, game) {
        this.sync(game);

        //Listen to server finish
        this.playerDisconnected();
    });

    function createLinesArray(linesCount) {
        var lines = [];

        for (var i = 0; i < linesCount; i += 1) {
            lines.push({});
        }

        return lines;
    }

    return gameController;
});