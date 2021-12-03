
//sap/ui/demo/template/index.js
sap.ui.define([
	"sap/ui/demo/template/myES6Module"
], function( myES6Module ) {
	"use strict";

	// Execute code which needs to be executed before component initialization
	myES6Module.then(function() {
		// Requiring the ComponentSupport module automatically executes the component initialisation for all declaratively defined components
		// With the declarative sap/ui/core/ComponentSupport API it is possible to define the initially started component directly in the HTML markup
		// instead of the imperative way using JavaScript.
		sap.ui.require(["sap/ui/core/ComponentSupport"]);
	})

});
