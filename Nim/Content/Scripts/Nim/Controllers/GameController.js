/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "Nim/Views/GameLayout", "Nim/Factories/GameModelFactory", "Nim/Domain/GameStates"], function ($, _, Backbone, Marionette, app, GameLayout, GameModelFactory, GameStates) {

    var GameController = Backbone.Marionette.Controller.extend({
        //Properties
        game: null,
        layout: null,

        //Constructor
        initialize: function () {
            this.listenTo(app, "server:crossOut", function (sum, game) {
                this.sync(game);

                //Crossout
                this.layout.canvas.currentView.crossOut(sum);

                //Check that it is not the current player
                if (this.game.get("currentTurn").get("playerId") !== app.user.get("playerId")) {

                    transitionEndFunc = function (gameController) {
                        return function () {

                            //Check if the game is still active
                            if (gameController.game.get("currentState").is(GameStates.ACTIVE)) {
                                //Trigger switch turn
                                gameController.switchTurn();
                            }

                            //Remove this function
                            gameController.layout.canvas.currentView.off("transitionEnd", transitionEndFunc(gameController));
                        }
                    };

                    //Add a event when the transition is done
                    this.layout.canvas.currentView.on("transitionEnd", transitionEndFunc(this));

                } else {
                    //Trigger switch turn
                    this.switchTurn();
                }
            });

            this.listenTo(app, "server:finish", function (finishData, sum, game) {
                var gameController = this;

                this.sync(game);

                //Crossout
                this.layout.canvas.currentView.crossOut(sum);

                require(["Nim/Factories/NimGameFinishModelFactory"], function (NimGameFinishModelFactory) {
                    //Create a appropriate model 
                    var finishModel = NimGameFinishModelFactory.create(finishData);

                    //Trigger finish
                    gameController.finish(finishModel);
                });
            });

            this.listenTo(app, "server:player:disconnect", function (player, game) {
                this.sync(game);

                //We only want to trigger playerDisconnected when the game is active, if it ended then th finishView will handle UI..
                if (this.game.get("currentState").not(GameStates.ENDED)) {
                    //Listen to server finish
                    this.playerDisconnected()
                }
            });

            this.listenTo(app, "server:play:start:again", function (game) {
                this.start(game);
            });

            this.listenTo(app, "server:play:user:joined:again", function (player, game) {
                this.sync(game);
            });
        },

        //Methods
        start: function (game) {
            var gameController = this,
                canvasViewModel;

            //We start by syncing the gameController
            this.sync(game);

            //Set the gameLayout
            this.layout = new GameLayout();

            //Display the layout
            app.content.show(this.layout);

            //Display the canvas

            require(["Nim/Views/CanvasView", "Nim/ViewModels/CanvasViewModel"], function (CanvasView, CanvasViewModel) {
                gameController.layout.canvas.show(new CanvasView({
                    controller: gameController,
                    model: new CanvasViewModel({
                        numberOfLines: gameController.game.get("activeGame").get("numberOfLines")
                    })
                }));
            });

            this.switchTurn();
        },
        sync: function (game) {
            //Make the game to a backbone model
            game = GameModelFactory.create(game);

            //Should be call every time a callback from the server comes
            this.game = game;
        },
        crossOut: function (sum) {
            //Close the buttons
            this.layout.command.close();

            // Send a message to the server about the sum of lines to cross out
            app.gameHub.server.requestCrossOut(this.game.get("gameId"), sum);
        },
        playAgain: function () { //When a user want to play again with the opponets
            // Tell the server that this player wants to play again
            app.gameHub.server.requestSpecificGame(this.game.get("gameId"));
        },
        finish: function (finishModel) {
            var gameController = this;

            require(["Nim/ViewModels/FinishViewModel", "Nim/Views/FinishView"], function (FinishViewModel, FinishView) {
                //Create a finish view
                var finishView = new FinishView({
                    model: new FinishViewModel({
                        winner: finishModel.get("winner"),
                        scores: finishModel.get("scores"),
                        currentPlayer: app.user
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

            //This user turn
            if (this.game.get("currentTurn").get("playerId") === app.user.get("playerId")) {
                //Close the waiting modal
                gameController.layout.modal.close();
                
                require(["Nim/Views/CommandView", "Nim/ViewModels/CommandViewModel"], function (CommandView, CommandViewModel) {
                    var activeGame = gameController.game.get("activeGame"),
                        commandView = new CommandView({
                            controller: gameController,
                            model: new CommandViewModel({
                                numberOfLines: activeGame.get("numberOfLines"),
                                crossedLines: activeGame.get("crossed")
                            })
                        });

                    gameController.layout.command.show(commandView);

                    //Play a sound..
                    require(["audio!Sounds/notify.ogg"], function (notifySound) {
                        notifySound.noteOn(0);
                    });
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

    return GameController;
});