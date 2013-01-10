/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/CanvasView.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var Orientation = {
        PORTRAIT: 0,
        LANDSCAPE: 1,
        getOrientation: function (width, height) {
            var orientation;

            console.log(width, height, width > height)

            if (width > height) {
                orientation = this.LANDSCAPE;
            } else {
                orientation = this.PORTRAIT;
            }

            return orientation;
        }
    },
        View = Backbone.Marionette.ItemView.extend({
            template: viewTemplate,
            tagName: "div",
            className: "canvas",
            crossed: 0,
            resize: function (options) {
                options = options || {}

                this.$el.css({
                    "width": "100%",
                    "height": 0 + "px"
                });

                var width = $(document).width(),
                    height = $(document).height();

                this.orientation = Orientation.getOrientation(width, height);

                if (this.orientation === Orientation.PORTRAIT) {
                    this.LINES_LENGTH = options.LINES_LENGTH || 10;
                    this.LINE_WIDTH = Math.floor(width / this.LINES_LENGTH);
                    this.LINE_HEIGHT = Math.floor((height - 100) / this.LINES_LENGTH);

                    this.$el.css({
                        "width": "100%",
                        "height": (height - 100) + "px"
                    }).empty();
                } else { //LANDSCAPE

                    this.LINES_LENGTH = options.LINES_LENGTH || 10;
                    this.LINE_WIDTH = Math.floor((width - 100) / this.LINES_LENGTH);
                    this.LINE_HEIGHT = Math.floor(height / this.LINES_LENGTH);

                    this.$el.css({
                        "width": (width - 100) + "px",
                        "height": height + "px",
                        "float": "left"
                    }).empty();

                }

                this.render();
                this.renderLine();
            },
            initialize: function (options) {
                var view = this;

                app.vent.on("window:resize", function () {
                    view.resize.call(view, options);
                });

                this.resize(options);
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
            }
        });

    return View;
});