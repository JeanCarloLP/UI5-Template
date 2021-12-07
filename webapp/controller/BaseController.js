

sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/routing/History',
    'sap/ui/core/Fragment'
], function( Controller, History, Fragment ) {
    'use strict';
    
    // The BaseController is inherited by all the controllers of the application.
    // Shared functionallity that can be triggered from multiple locations in the app.
    const BaseController = Controller.extend(
        "sap.ui.demo.template.controller.BaseController", {
            navProps: null
        }
    );

    // Register onRouteMatchedEvent in the baseController.
    // Careful with arrow functions, due they dont use 'this' in enclosing scopes and prototype functions
    // 'this' on arrow functions make reference to the global object.
    BaseController.prototype.onInit = function() {
        if( this.getRouter() ) {
            this.getRouter().attachEvent(
                'routeMatched',
                {},
                this.onRouteMatched,
                this
            );
        }
    };

    // The base handler for on route matched. Stores the navigation arguments in a variable, so we can reuse it again later.
    // Also arrow functions DON'T have the arguments object
    BaseController.prototype.onRouteMatched = function( event ) {
        this.navProps = event.getParameter('arguments') || {};
    }

    // Method for accessing the router in every controller of the application
    BaseController.prototype.getRouter = function() {
        const ownerComponent = this.getOwnerComponent();
        if( !ownerComponent ) return null;

        return ownerComponent.getRouter();
    }

    // Method for getting the view model by name in every controller of the application
    BaseController.prototype.getModel = function( sName ) {
        return this.getView().getModel( sName );
    }

    // Method to set the view model in every controller of the application
    BaseController.prototype.setModel = function( oModel, sName ) {
        return this.getView().setModel( oModel, sName );
    }

    // Method to get the resource bundle
    BaseController.prototype.getResourceBundle = function() {
        if( this.resourceBundle )
            return this.resourceBundle;
        
        this.resourceBundle = this.getOwnerComponent()
            .getModel('i18n')
            .getResourceBundle();
        
        return this.resourceBundle
    }

    // Event Handler to navigate back
    BaseController.prototype.onNavBack = function() {
        let sPreviousHash = History.getInstance().getPreviousHash();

        if( sPreviousHash !== undefined )
            history.go(-1); //previous entry
        else 
            this.getRouter().navTo( 'master', {}, true ); // go backwards with a forward history 

    }

    // Method to routing
    BaseController.prototype.navTo = function( route, params ) {
        let parentChild = this.navProps || {},
            resultParams = {};

        params = params || {}

        for ( let key in parentChild )
            resultParams[key] = parentChild[key];
        
        for ( let key in params )
            resultParams[key] = params[key];
        
        this.getRouter().navTo(route, resultParams);
    }

    // Method to retrieve the component parameters
    BaseController.prototype.getStartUpParameters = function() {
        return (
            this.getOwnerComponent().getComponentData().startUpParameters || {}
        );
    }

    return BaseController;
});
