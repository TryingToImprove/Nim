/// <reference path="../docs.js" />

define(["PhoneAPI", "$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/CanvasView.html"], function (PhoneAPI, $, _, Backbone, Marionette, app, viewTemplate) {
    "use strict";

    var Orientation = PhoneAPI.Orientation,

        View = Backbone.Marionette.ItemView.extend({
            template: viewTemplate,
            tagName: "div",
            className: "canvas",
            crossed: 0,
            onShow: function(){
                var that = this;
                $("#cross-line").on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(){ 
                    that.trigger("transitionEnd"); 
                });
            },
            resize: function (options) {
                //Reset the canvas dimensions so we don't fuck up the layout
                this.$el.css({
                    "width": "100%",
                    "height": 0 + "px"
                });

                var cssClassNew,
                    cssClassOld,

                    $document = $(document),
                    width = $document.width(),
                    height = $document.height(),

                    //Get current orientation
                    orientation = this.orientation = Orientation.getOrientation(width, height);

                switch(orientation){
                    case Orientation.PORTRAIT:
                        //Make space at the bottom
                        height -= 100;

                        //define css class for portrait orientation
                        cssClassNew = "portrait-mode";
                        cssClassOld = "landscape-mode";
                        break;
                    case Orientation.LANDSCAPE:
                        //Make space to the left
                        width -= 100;

                        //define css class for landscape orientation
                        cssClassOld = "portrait-mode";
                        cssClassNew = "landscape-mode";
                        break;
                }

                //Calculate the new value for the lines
                this.calculateLineDimensions(this.LINES_LENGTH, width, height);

                //Set the canvas
                this.$el.css({
                    "width": (width) + "px",
                    "height": height + "px"
                })
                .removeClass(cssClassOld) //remove the old css class
                .addClass(cssClassNew) //add the new css class
                .empty();

                //Render
                this.render();
                this.renderLine();
            },
            calculateLineDimensions: function(numberOfLines, width, height){
                //Get the new line width
                this.LINE_WIDTH = Math.floor(width / numberOfLines);

                //Get the new line height
                this.LINE_HEIGHT = Math.floor(height / numberOfLines);
            },
            initialize: function (options) {
                options = options || {}; //Make sure there is a options object

                //Set the number of lines
                this.LINES_LENGTH = this.model.get("lines").length;

                //Listen to callback from the server
                this.listenTo(options.controller, "server:crossOut", function (sum, game) {
                    this.crossOut(sum);
                });

                //Listen to resize events
                this.listenTo(app, "window:resize", function(){
                
                    var $document = $(document),
                    width = $document.width(),
                    height = $document.height();


                    if(this.orientation !== Orientation.getOrientation(width, height)){
                        console.log("resize");
                        this.resize(options);
                    }
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
                var position = {
                        left: 0,
                        top: 0
                    },
                    width, height,
                    cssClassMode,
                    crossLine = $("#cross-line");

                switch(this.orientation){
                    case Orientation.PORTRAIT:
                        //Set the position on the x-axis (left css)
                        position.left = ((this.$el.width() / 2) - (this.spec.cross.height / 2));

                        width = this.spec.cross.height;
                        height = this.LINE_HEIGHT * this.crossed;

                        break;
                    case Orientation.LANDSCAPE:
                        //Set the position on the y-axis (top css)
                        position.top = ((this.$el.height() / 2) - (this.spec.cross.height / 2));

                        width = this.LINE_WIDTH * this.crossed;
                        height = this.spec.cross.height;
                        break;
                }

                crossLine.css({
                    "top": position.top + "px",
                    "left": position.left + "px",
                    "width": width + "px",
                    "height": height + "px"
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
                        y = 0 + "px",
                        x = 0 + "px";

                    if (that.orientation === Orientation.LANDSCAPE) {
                        width = that.LINE_WIDTH;
                        y = "10%";
                        height = "90%";
                        lineWidth = that.spec.line.size + "px";
                        lineHeight = "80%";
                        x = Math.floor((that.LINE_WIDTH * i)) + "px";
                    } else {
                        marginTop = (that.LINE_HEIGHT / 2) - (that.spec.line.size / 2) + "px";
                        height = that.LINE_HEIGHT;
                        lineWidth = "80%";
                        lineHeight = that.spec.line.size + "px";
                        y = Math.floor((that.LINE_HEIGHT * i)) + "px";
                    }

                    $this.css({
                        "height": height,
                        "width": width,
                        "top": y,
                        "left": x
                    });

                    $(".line", $this).css({
                        "margin-top": marginTop,
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