/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/CanvasView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var View = Backbone.Marionette.ItemView.extend({
        template: viewTemplate,
        tagName: "div",
        className: "canvas",
        crossed: 0,
        initialize: function (options) {
            var width = $(document).width(), height = $(document).height() - 100;

            options = options || {}

            this.LINES_LENGTH = options.LINES_LENGTH || 10;
            this.LINE_WIDTH = width / this.LINES_LENGTH;
            this.LINE_HEIGHT = height / this.LINES_LENGTH;


            this.$el.css({
                "width": width + "px",
                "height": height + "px"
            });
        },
        crossOut: function (sum) {
            if (sum > this.getLinesLeft()) {
                throw new Error("There are not lines enough to cross " + sum);
            }

            this.crossed += sum;

            this.renderLine();
        },
        renderLine: function () {
            var x, y, crossLine = $("#cross-line"), size;

            if (!window.matchMedia("(max-width: 767px)").matches) {
                size = (this.LINE_WIDTH * this.crossed);

                y = ((this.$el.height() / 2) - (this.spec.cross.height / 2)) + "px";
                x = 0;
                width = size;
                height = this.spec.cross.height;

            } else {
                size = (this.LINE_HEIGHT * this.crossed);

                y = 0;
                x = ((this.$el.width() / 2) - (this.spec.cross.height / 2)) + "px";
                width = this.spec.cross.height;
                height = size;
            }

            crossLine.css({
                "top": y,
                "left": x,
                "width": width,
                "height": height
            });
        },
        getLinesLeft: function () {
            return this.LINES_LENGTH - this.crossed;
        },
        onRender: function () {


            var that = this;

            $(".horizontal-holder", this.$el).each(function (i) {

                var $this = $(this), 
                    marginTop = 0, 
                    width = "100%", 
                    height = "100%", 
                    lineWidth = "100%",
                    lineHeight = "100%",
                    y = 0, 
                    x = 0;

                if (!window.matchMedia("(max-width: 767px)").matches) {
                    width = that.LINE_WIDTH;
                    lineWidth = that.spec.line.size + "px";
                    x = Math.floor((that.LINE_WIDTH * i));
                } else {
                    marginTop = (that.LINE_HEIGHT / 2) - (that.spec.line.size / 2);
                    height = that.LINE_HEIGHT;
                    lineHeight = that.spec.line.size + "px";
                    y = Math.floor((that.LINE_HEIGHT * i));
                }

                $this.css({
                    "height": height,
                    "width": width,
                    "top": y + "px",
                    "left": x + "px"
                });

                $(".line", $this).css({
                    "margin-top": marginTop + "px",
                    "height": lineHeight,
                    "width": lineWidth
                });

            });

            this.renderLine();


        },
        spec: {
            line: {
                size: 10,
            },
            cross: {
                height: 30
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