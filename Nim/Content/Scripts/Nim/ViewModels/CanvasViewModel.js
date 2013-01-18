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
        updateLines: function (numberOfLines) {
            this.set("lines", createLinesArray(numberOfLines));
        },
        initialize: function (attrs, options) {
            //Make a array of lines when the number of lines changes
            this.on("change:numberOfLines", function (model, numberOfLines) {
                model.updateLines.call(model, numberOfLines);
            });

            this.updateLines(this.get("numberOfLines"));
        }
    });

    return Model;
});