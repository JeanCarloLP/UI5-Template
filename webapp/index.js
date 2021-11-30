
//sap/ui/demo/template/index.js
sap.ui.define([
	"sap/ui/demo/template/myES6Module"
], function ( myES6Module ) {
	"use strict";

	// Execute code which needs to be executed before component initialization
	myES6Module.then(function() {
		// Requiring the ComponentSupport module automatically executes the component initialisation for all declaratively defined components
		sap.ui.require(["sap/ui/core/ComponentSupport"]);
	})

});
