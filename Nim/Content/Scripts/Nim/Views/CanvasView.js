/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/CanvasView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        tagName: "canvas",
        crossed: 0,
        initialize: function (options) {
            var width = $(document).width();

            options = options || {}

            this.LINES_LENGTH = options.LINES_LENGTH || 10;
            this.LINE_WIDTH = Math.floor(width / this.LINES_LENGTH);


            this.$el.attr("width", width);
            this.$el.attr("height", $(document).height() - 100);

            this.draw();
        },
        crossOut: function (sum) {
            if (sum > this.getLinesLeft()) {
                throw new Error("There are not lines enough to cross " + sum);
            }

            this.crossed += sum;
            this.draw();
        },
        getLinesLeft: function () {
            return this.LINES_LENGTH - this.crossed;
        },
        spec: {
            line: {
                width: 10,
                height: 100
            },
            cross: {
                height: 10
            }
        },
        draw: function () {
            var i, line, ctx = this.$el[0].getContext("2d"), x, y;

            ctx.fillStyle = "#000"; ;

            for (i = 0; i < this.LINES_LENGTH; i += 1) {
                y = 0;
                x = Math.floor((this.LINE_WIDTH * i) + ((this.LINE_WIDTH / 2) - (this.spec.line.width / 2)));

                ctx.fillRect(x, y, this.spec.line.width, this.spec.line.height);
            }

            ctx.fillStyle = "red";
            for (i = 0; i < this.crossed; i += 1) {
                y = Math.floor(((this.spec.line.height / 2) - (this.spec.cross.height / 2)));
                x = (this.LINE_WIDTH * i);

                ctx.fillRect(x, y, this.LINE_WIDTH, this.spec.cross.height);
            }

        }
    });

    return View;
});