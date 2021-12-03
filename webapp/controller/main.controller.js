

sap.ui.define([
    'sap/ui/demo/template/controller/baseController'
], function( baseController ) {
    'use strict';

    const MainController = baseController.extend(
        'sap.ui.demo.template.controller.Main', { 
            constructor: function() {}
        }
    );

    MainController.prototype.onInit = function() {
        baseController.prototype.onInit.apply( this, arguments );
    };

    return MainController;
    
});