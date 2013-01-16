/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "SignalR"], function ($, _, Backbone, Marionette, SignalR) {

    var app = new Backbone.Marionette.Application();

    //Add the regions
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
        require(["Nim/Views/IdleView"], function (IdleView) {
            var userDTO,
                idleView;

            //#region UI

            //Create a idleView
            idleView = new IdleView();

            //Display the idle view
            app.content.show(new IdleView());

            //#endregion

            app.vent.trigger("game:request:new");
        })
    });

    app.vent.on("game:request:new", function () {
        require(["Nim/Factories/UserFactory"], function (UserFactory) {
            //Create a DTO of user
            userDTO = UserFactory.createDTO(app.user)

            //Start a request for a game
            app.gameHub.server.requestGame(userDTO);
        });
    });

    app.vent.listenTo(app, "game:start", function (game) {
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


        require(["Nim/Views/LoginView"], function (LoginView) {

            app.gameHub = $.connection.game;

            app.gameHub.client.Publish = function () {
                app.vent.trigger.apply(app, arguments);
            };

            var loginView = new LoginView();

            app.content.show(loginView);

            $.connection.hub.start();
        });

    });

    return app;
});