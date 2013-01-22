define(["$", "Underscore", "Backbone", "Marionette", "Handlebars"], function ($, _, Backbone, Marionette, Handlebars) {
    var handlebarsTemplate = function () {
        Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
            return Handlebars.compile(rawTemplate);
        };

        Handlebars.registerHelper('score_each', function (obj, options) {
            var template = "", score, i, scoreLength = obj.scores.length;

            for (i = 0; i < scoreLength; i += 1) {
                score = obj.scores[i];

                template += options.fn({
                    playerName: (score.get("player").get("playerId") === obj.currentPlayer.get("playerId")) ? "you" : score.get("player").get("name"),
                    wins: score.get("wins"),
                    state: score.get("state")
                });
            }

            return template;
        });
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
                        throw new Error(key + " was not found!! Check model defaults");
                    }
                }, this);
            }

            options = options || {};
            attrs = attrs || {};

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