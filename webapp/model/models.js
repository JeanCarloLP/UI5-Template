

sap.ui.define([
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device'
], function( JSONModel, Device ) {
    'use strict';

    const createDeviceModel = () => {
        let oModel = new JSONModel( Device );
        oModel.setDefaultBindingMode( sap.ui.model.BindingMode.OneWay );
        return oModel;
    }
    
});
