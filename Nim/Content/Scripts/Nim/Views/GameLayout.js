/// <reference path="../docs.js" />

define(["$", "Underscore", "Backbone", "Marionette", "Nim/App", "text!Templates/GameLayout.html"], function ($, _, Backbone, Marionette, app, viewTemplate) {

    var ModalRegion = Backbone.Marionette.Region.extend({
        el: ".modal-holder",
        constructor: function () {
            _.bindAll(this);
            Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);

            this.on("view:show", this.showModal, this);
        },
        getEl: function (selector) {
            var $el = $(selector);
            $el.on("hidden", this.close);
            return $el;
        },
        showModal: function (view) {
            view.on("close", this.hideModal, this);
        },
        hideModal: function () {
            this.$el.modal('hide');
        }
    });

    var Layout = Backbone.Marionette.Layout.extend({
        template: viewTemplate,
        regions: {
            modal: ".modal",
            canvas: ".canvas-holder",
            command: ".commands-holder"
        }
    });

    return Layout;
});