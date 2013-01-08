/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "SignalR"], function ($, _, Backbone, Marionette, SignalR) {

    var app = new Backbone.Marionette.Application();

    app.addRegions({
        content: "#nim"
    });

    app.user = "";

    app.vent.on("user:authenticate", function (name) {
        require(["Nim/Factories/UserFactory"], function (UserFactory) {
            var user = UserFactory.create(name);

            app.vent.trigger("user:authenticated", user);
        });
    });

    app.vent.on("user:authenticated", function (user) {
        app.user = user;
        app.vent.trigger("game:idle");
    });

    app.vent.on("game:idle", function () {
        require(["Nim/Views/IdleView"], function (IdleView) {
            app.content.show(new IdleView());
            app.gameHub.server.requestGame(app.user.get("name"));
        })
    });

    app.vent.on("game:start", function (game) {
        require(["Nim/Controllers/GameController"], function (GameController) {
            app.gameController = GameController.start(game, app.gameHub);
        });
    });

    app.addInitializer(function () {
        app.gameHub = $.connection.game;

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