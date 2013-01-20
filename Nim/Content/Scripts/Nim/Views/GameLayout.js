/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/GameLayout.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var ModalRegion = Backbone.Marionette.Region.extend({
        constructor: function () {
            _.bindAll(this);
            Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
            this.on("show", this.showModal, this);
        },

        getEl: function (selector) {
            var $el = $(selector);
            $el.on("hidden", this.close);
            return $el;
        },

        showModal: function (view) {
            view.on("close", this.hideModal, this);
            view.$el.modal('show');
        },

        hideModal: function () {
            this.currentView.$el.modal('hide');
        }
    }),
        Layout = Backbone.Marionette.Layout.extend({
            template: viewTemplate,
            tagName: "div",
            className: "heightBuilder",
            regions: {
                modal: {
                    selector: ".modal-holder",
                    regionType: ModalRegion
                },
                canvas: ".canvas-holder",
                command: ".commands-holder"
            }
        });

    return Layout;
});