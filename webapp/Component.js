

sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/demo/template/model/models'
], function ( UIComponent, models ) {
    'use strict';
    
    // The main Component of your App. This also serves as public interface when your component is embedded in another app.
    // Be sure to define properties and events that need to be accesible from outside, as well as public method.
    const Component = UIComponent.extend(
        'sap.ui.demo.template.Component', {
            metadata: {
                manifest: 'json'
            },
            gitUrl: ''
        }
    );

    // Initialization of manifest, device model (if exists) and router (if exists)
    Component.prototype.init = function() {
        UIComponent.prototype.init.apply( this, arguments );

        // Set the device model
        if( models )
            this.setModel( models.createDeviceModel(), 'device' );
        

        // Initialize the router
        if( this.getRouter() )
            this.getRouter().initialize();
        
    };

    return Component;

});
