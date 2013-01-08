define(["$", "Underscore", "Backbone", "Marionette", "Handlebars"], function ($, _, Backbone, Marionette, Handlebars) {

    var handlebarsTemplate = function () {
        Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
            return Handlebars.compile(rawTemplate);
        };
    }

    return {
        configure: function () {

            //Use handlebars as templater
            handlebarsTemplate();

        }
    }
});