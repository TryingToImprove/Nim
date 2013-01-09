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
            this.LINE_WIDTH = Math.floor(width / this.LINES_LENGTH);
            this.LINE_HEIGHT = Math.floor(height / this.LINES_LENGTH);


            this.$el.css({
                "width": width + "px",
                "height": height + "px"
            });

            //this.draw();
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

                var $this = $(this);

                if (!window.matchMedia("(max-width: 767px)").matches) {
                    $this.height("100%").width(that.LINE_WIDTH);
                    
                    $(".line", $this).css({
                        "width": that.spec.line.size
                    });

                    y = 0;
                    x = Math.floor((that.LINE_WIDTH * i));
                } else {
                    $this.height(that.LINE_HEIGHT).width("100%");

                    $(".line", $this).css({
                        "margin-top": (that.LINE_HEIGHT / 2) - (that.spec.line.width / 2) + "px",
                        "height": that.spec.line.size
                    });

                    y = Math.floor((that.LINE_HEIGHT * i));
                    x = 0;
                }

                $this.css({
                    "top": y + "px",
                    "left": x + "px"
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