/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/Models/CanvasModel"], function ($, _, Backbone, Marionette, CanvasModel) {

    function createLinesArray(linesCount) {
        var lines = [];

        for (var i = 0; i < linesCount; i += 1) {
            lines.push({});
        }

        return lines;
    }

    return {
        create: function (numberOfLines) {
            var model = new CanvasModel({
                lines: createLinesArray(numberOfLines)
            });

            return model;
        }
    };
});