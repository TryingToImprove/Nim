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
            app.content.show(new IdleView());

            //            app.vent.trigger("game:start", {
            //                GameId: 323,
            //                Lines: 10,
            //                CurrentTurn: ""
            //            });

            app.gameHub.server.requestGame(UserFactory.createDTO(app.user));
        })
    });

    app.vent.on("game:start", function (game) {
        require(["Nim/Controllers/GameController"], function (GameController) {
            app.gameController = GameController.start(game, app.gameHub);
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
            app.gameController.crossOut(sum, game);
        };

        app.gameHub.client.responseGameEnd = function (loser, game) {
            app.gameController.finish(loser, game);
        };

        $.connection.hub.start().done(function () {
            require(["Nim/Views/LoginView"], function (LoginView) {
                app.content.show(new LoginView());
            });
        })
    });

    return app;
});