"use strict";

sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "./controller/HelloDialog"], function (UIComponent, JSONModel, HelloDialog) {
  "use strict";

  return UIComponent.extend("sap.ui.demo.walkthrough.Component", {
    metadata: {
      interfaces: ["sap.ui.core.IAsyncContentCreation"],
      manifest: "json"
    },
    init: function init() {
      // call the init function of the parent
      UIComponent.prototype.init.apply(this, arguments); // set data model

      var oData = {
        recipient: {
          name: "World"
        }
      };
      var oModel = new JSONModel(oData);
      this.setModel(oModel); // set dialog, we wait for the

      this.rootControlLoaded().then(function () {
        this._helloDialog = new HelloDialog(this.getRootControl());
      }.bind(this));
    },
    exit: function exit() {
      if (this._helloDialog) {
        this._helloDialog.destroy();

        delete this._helloDialog;
      }
    },
    openHelloDialog: function openHelloDialog() {
      this._helloDialog.open();
    }
  });
});