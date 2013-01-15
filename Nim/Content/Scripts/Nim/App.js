/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "SignalR"], function ($, _, Backbone, Marionette, SignalR) {

    var app = new Backbone.Marionette.Application();

    app.addRegions({
        content: "#nim"
    });

    app.user = "";

    app.vent.on("user:authenticate", function (name) {
        require(["Nim/Factories/UserFactory"], function (UserFactory) {
            var user = UserFactory.create(name, app.gameHub.connection.id);

            app.vent.trigger("user:authenticated", user);
        });
    });

    app.vent.on("user:authenticated", function (user) {
        app.user = user;
        app.vent.trigger("game:idle");
    });

    app.vent.on("game:idle", function () {
        require(["Nim/Views/IdleView", "Nim/Factories/UserFactory"], function (IdleView, UserFactory) {
            var userDTO,
                idleView;

            //#region UI

            //Create a idleView
            idleView = new IdleView();

            //Display the idle view
            app.content.show(new IdleView());

            //#endregion

            //#region server

            //Create a DTO of user
            userDTO = UserFactory.createDTO(app.user)

            //Start a request for a game
            app.gameHub.server.requestGame(userDTO);

            //#endregion
        })
    });

    app.vent.on("game:start", function (game) {
        require(["Nim/Controllers/GameController.v2"], function (gameController) {
            //Add a reference to the controller from the app
            app.gameController = gameController;

            //Start the game
            app.gameController.start(game, app.gameHub);
        });
    });

    app.addInitializer(function () {
        window.addEventListener("resize", function () { app.vent.trigger("window:resize"); }, false);
    });

    app.addInitializer(function () {
        app.gameHub = $.connection.game;

        app.gameHub.logging = true;


        // Declare a function on the chat hub so the server can invoke it          
        app.gameHub.client.startGame = function (game) {
            app.vent.trigger("game:start", game);
        };

        app.gameHub.client.responseCrossOut = function (sum, game) {
            app.gameController.trigger("server:crossOut", sum, game);
        };

        app.gameHub.client.responseGameEnd = function (loser, game) {
            app.gameController.trigger("server:finish", loser, game);
        };

        app.gameHub.client.playerDisconnected = function (player) {
            app.gameController.trigger("server:player:disconnect", player);
            console.log("Disconnect: ", player);
        };

        $.connection.hub.start().done(function () {
            require(["Nim/Views/LoginView"], function (LoginView) {
                app.content.show(new LoginView());
            });
        })
    });

    return app;
});