

sap.ui.define([
    'sap/ui/demo/template/controller/baseController'
], function( baseController ) {
    'use strict';
    
    const AppController = baseController.extend(
        'sap.ui.demo.template.controller.app', {
            constructor: function() {}
        }
    );

    AppController.prototype.onInit = function() {};

    return AppController;

});
