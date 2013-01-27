require.config({
    deps: ["$", "Underscore", "Backbone", "Marionette", "Handlebars", "Bootstrap"],
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
        },
        Bootstrap: {
            deps: ["$"]
        }
    },
    paths: {
        $: "Vendor/JQuery/jquery-1.8.3",
        SignalR: "Vendor/JQuery/SignalR/jquery.signalR-1.0.0-rc1",
        Underscore: "Vendor/Underscore/underscore",
        Backbone: "Vendor/Backbone/backbone",
        Marionette: "Vendor/Backbone/Marionette/backbone.marionette",
        Handlebars: "Vendor/Handlebars/handlebars-1.0.rc.1",
        Templates: "../Templates",
        Sounds: "../Sounds",
        PhoneAPI: "PhoneUtilities/PhoneUtilities",
        Bootstrap: "Vendor/Bootstrap/bootstrap",

        //requireJS plugins
        audio: "Vendor/RequireJS/Plugins/audio",
        text: "Vendor/RequireJS/Plugins/text",
        noext: "Vendor/RequireJS/Plugins/noext"
    }
});

require(["CustomConfiguration", "SignalR", "Nim/App"], function (CustomConfiguration, SignalR, App) {
    require(["noext!signalr/hubs"], function (hubs) {
        //Configure
        CustomConfiguration.configure();

        //Start game
        App.start();
    });
});