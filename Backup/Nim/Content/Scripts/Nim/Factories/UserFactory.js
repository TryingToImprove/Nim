/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/Models/User"], function ($, _, Backbone, Marionette, User) {
    return {
        create: function (name) {
            var user = new User({ name: name });
            return user;
        }
    };
});