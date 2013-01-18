/// <reference path="../docs.js" />

define(["Underscore"], function (_) {

    return {
        createMultiple: function (objects) {
            var createdObjects = [],
                createFunc = this.create; //save reference to the create function

            //Loop over the objects and push the created object to the createdObjects array.
            _.each(objects, function (obj) {
                createdObjects.push(createFunc(obj));
            });

            return createdObjects;
        },
        extend: function (extendProps) {

            var obj = {};

            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    obj[prop] = this[prop];
                }
            }

            _.extend(obj, extendProps);

            return obj;
        }
    };
});