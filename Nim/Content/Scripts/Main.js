require.config({
    deps: ["$", "Underscore", "Backbone", "Marionette", "Handlebars"],
    shim: {
        $: {
            exports: "jQuery"
        },
        Underscore: {
            exports: "_"
        },
        Backbone: {
            deps: ["Underscore", "$"],
            exports: "Backbone"
        },
        Marionette: {
            deps: ["Backbone"],
            exports: "Backbone.Marionette"
        },
        Handlebars: {
            exports: "Handlebars"
        },
        SignalR: {
            deps: ["$"]
        }
    },
    paths: {
        $: "Vendor/JQuery/jquery-1.8.3",
        SignalR: "Vendor/JQuery/SignalR/jquery.signalR-1.0.0-rc1",
<<<<<<< HEAD
        SignalRhub: "../../signalr/hubs",
=======
>>>>>>> 21982dab4c15c5294b24f8b859c8e6198cab3de2
        Underscore: "Vendor/Underscore/underscore",
        Backbone: "Vendor/Backbone/backbone",
        Marionette: "Vendor/Backbone/Marionette/backbone.marionette",
        Handlebars: "Vendor/Handlebars/handlebars-1.0.rc.1",
        Templates: "../Templates",

        //requireJS plugins
        text: "Vendor/RequireJS/Plugins/text",
        noext: "Vendor/RequireJS/Plugins/noext"
    }
});


<<<<<<< HEAD
require(["CustomConfiguration", "SignalR", "noext!SignalRhub", "Nim/App"], function (CustomConfiguration, SignalR, hubs, App) {
=======
require(["CustomConfiguration", "SignalR", "Nim/App"], function (CustomConfiguration, SignalR, App) {
    require(["noext!signalr/hubs"], function (hubs) {

        //Configure
        CustomConfiguration.configure();
>>>>>>> 21982dab4c15c5294b24f8b859c8e6198cab3de2

        //Start game
        App.start();

    });
});