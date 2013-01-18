/// <reference path="../docs.js" />

define(["Underscore"], function (_) {
    return {
        PORTRAIT: 0,
        LANDSCAPE: 1,
        getOrientation: function (width, height) {
            var currentOrientation,
                temp,

                realWidth,
                realHeight;

            //Check if there is only 1 argument
            if (arguments.length === 1) {
                temp = width;

                //Get the values from temp by either use jQuery or dom
                realWidth = (temp.width) ? temp.width() : temp.outerWidth;
                realHeight = (temp.height) ? temp.height() : temp.outerHeight;
            } else {
                //Set realWidth and height
                realWidth = width;
                realHeight = height;
            }

            if (realWidth > realHeight) { //If width is larger than height then it is landscape
                currentOrientation = this.LANDSCAPE;
            } else { //Otherwise it is portrait
                currentOrientation = this.PORTRAIT;
            }

            return currentOrientation;
        }
    }
});