sap.ui.define([
    'sap/ui/demo/template/controller/BaseController'
], function ( BaseController ) {
    'use strict';
    
    const AppController = BaseController.extend(
        'sap.ui.demo.template.controller.App', {
            constructor: function() {}
        }
    );

    AppController.prototype.onInit = function () {};

    return AppController;

});
