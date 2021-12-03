

sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/demo/template/model/models'
], function( UIComponent, models ) {
    'use strict';
    
    // This is the manin Component of your App, also serves as public interface when your component is embedded in another app.
    // Define here properties and events that need to be accesible from outside, as well as public methods.
    const Component = UIComponent.extend(
        'sap.ui.demo.template.component', {
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
            this.setModel( models.createDeviceModel(), 'modelDevice' );
        

        // Initialize the router
        if( this.getRouter() )
            this.getRouter().initialize();
        
    };

    return Component;

});
