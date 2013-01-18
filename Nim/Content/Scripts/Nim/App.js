/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "SignalR"], function ($, _, Backbone, Marionette, SignalR) {

    var app = new Backbone.Marionette.Application();

    //Add the regions
    app.addRegions({
        content: "#nim"
    });

    app.user = "";

    app.vent.on("user:authenticate", function (name) {
        require(["Nim/Factories/PlayerModelFactory"], function (PlayerModelFactory) {
            var playerId = app.gameHub.connection.id,
                player = PlayerModelFactory.create({
                    "Name": name,
                    "PlayerId": playerId,
                    "Connection": { ConnectionId: playerId }
                });

            app.vent.trigger("user:authenticated", player);
        });
    });

    app.vent.on("user:authenticated", function (user) {
        app.user = user;
        app.vent.trigger("game:idle");
    });

    app.vent.on("game:idle", function () {
        require(["Nim/Views/SearchingForOpponentView"], function (SearchingForOpponentView) {
            var searchingForOpponentView;

            //Create a searchingForOpponentView
            searchingForOpponentView = new SearchingForOpponentView();

            //Display the searchingForOpponentView view
            app.content.show(searchingForOpponentView);

            app.vent.trigger("game:request:new");
        })
    });

    app.vent.on("game:request:new", function () {
        require(["Nim/Factories/PlayerModelFactory"], function (PlayerModelFactory) {
            //Create a DTO of user
            var userDTO = PlayerModelFactory.toJSON(app.user)

            //Start a request for a game
            app.gameHub.server.requestGame(userDTO);
        });
    });

    app.vent.listenTo(app, "game:start", function (game) {
        require(["Nim/Controllers/GameController"], function (GameController) {
            if (app.gameController) {
                app.gameController.close();
            }

            //Add a reference to the controller from the app
            app.gameController = new GameController();

            //Start the game
            app.gameController.start(game, app.gameHub);
        });
    });

    app.vent.listenTo(app, "show:login", function () {
        require(["Nim/Views/LoginView"], function (LoginView) {
            var loginView = new LoginView();

            app.content.show(loginView);
        });
    });

    //Initializer that add events to the window object
    app.addInitializer(function () {
        window.addEventListener("resize", function () {
            app.vent.trigger.apply(app, ["window:resize"]);
        }, false);
    });

    //Initializer that start a connection
    app.addInitializer(function () {
        this.gameHub = $.connection.game;

        this.gameHub.client.Publish = function () {
            app.vent.trigger.apply(app, arguments);
        };

        //Start the hub connection
        $.connection.hub.start();
    });

    //Initialzier that displays the login screen
    app.addInitializer(function () {
        this.vent.trigger.apply(this, ["show:login"]);
    });

    return app;
});