/// <reference path="../docs.js" />

define(["Underscore", "Backbone"], function (_, Backbone) {
    "use strict"; 

    function createLinesArray(linesCount) {
        var lines = [];

        for (var i = 0; i < linesCount; i += 1) {
            lines.push({});
        }

        return lines;
    }

    var Model = Backbone.Model.extend({
        defaults: {
            lines: [],
            numberOfLines: null
        },
        constructor: function (attrs, options) {
            //Make a array of lines when the number of lines changes
            this.on("change:numberOfLines", function (model, numberOfLines) {
                model.set("lines", createLinesArray(numberOfLines));
            });

            Backbone.Model.prototype.constructor.apply(this, arguments);
        }
    });

    return Model;
});