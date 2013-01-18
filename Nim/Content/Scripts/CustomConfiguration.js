define(["$", "Underscore", "Backbone", "Marionette", "Handlebars"], function ($, _, Backbone, Marionette, Handlebars) {
    var handlebarsTemplate = function () {
        Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
            return Handlebars.compile(rawTemplate);
        };
    },
    underscoreMixins = function () {
        _.mixin({
            validateProperties: function (obj, properties) {
                var validated = true; //flag

                //Loop over the properties that are required
                _.each(properties, function (prop) {
                    //Check if the player does not have the required property
                    if (!obj.hasOwnProperty(prop)) {
                        validated = false; //Mark it is not validated
                    }
                });

                return validated;
            }
        });
    },
    backboneMixins = function () {

        Backbone.Model.prototype.strict = true;
        Backbone.Model.prototype._validate = function (attrs, options) {
            //If strict mode
            if (this.strict) {
                //Validate that properties sat is in the defaults
                _.each(attrs, function (value, key) {
                    if (!this.defaults.hasOwnProperty(key)) {
                        throw new Error(key + " was not found!!");
                    }
                }, this);
            }

            if (!options.validate || !this.validate) return true;
            attrs = _.extend([], this.attributes, attrs);
            var error = this.validationError = this.validate(attrs, options) || null;
            if (!error) return true;
            this.trigger("invaqlid", this, error, options || {});
            return false;
        };

    };

    return {
        configure: function () {
            //Use handlebars as templater
            handlebarsTemplate();

            //Setup underscore mixin (extending underscore functionality)
            underscoreMixins();

            backboneMixins();
        }
    }
});