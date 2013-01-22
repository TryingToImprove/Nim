/// <reference path="../docs.js" />

define(["Underscore", "Backbone", "Nim/ViewModels/CommandButtonViewModel"], function (_, Backbone, CommandButtonViewModel) {
    "use strict";

    function createButtons(numberOfLines, crossedLines) {
        var delta = numberOfLines - 1 - crossedLines,
            amounth = Math.min(delta, 3),
            i, buttons = [];

        for (i = 0; i < amounth; i += 1) {
            var sum = i + 1;

            buttons.push(new CommandButtonViewModel({
                sum: sum,
                text: sum
            }));
        }

        return buttons;
    };

    var Model = Backbone.Model.extend({
        defaults: {
            crossedLines: 0,
            numberOfLines: null,
            commandButtons: []
        },
        updateButtons: function (numberOfLines, crossedLines) {
            this.set("commandButtons", createButtons(numberOfLines, crossedLines));
        },
        initialize: function (attrs, options) {
            this.updateButtons(this.get("numberOfLines"), this.get("crossedLines"));
        },
        toJSON: function () {

            var commandButtons = this.get("commandButtons"), arr = [], i, length = commandButtons.length;
            for (i = 0; i < length; i += 1) {
                arr.push(commandButtons[i].toJSON());
            }

            return {
                lines: this.get("lines"),
                numberOfLines: this.get("numberOfLines"),
                commandButtons: arr
            };
        }
    });

    return Model;
});