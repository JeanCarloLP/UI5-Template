

sap.ui.define([
    'sap/ui/demo/template/controller/BaseController',
    'sap/ui/model/json/JSONModel'
], function( BaseController, JSONModel  ) {
    'use strict';

    const DetailController = BaseController.extend(
        'sap.ui.demo.template.controller.Detail', { 
            constructor: function() {}
        }
    );

    DetailController.prototype.onInit = function() {
        BaseController.prototype.onInit.apply( this, arguments );
        this.getRouter().getRoute('detail').attachPatternMatched( this.onObjectMatched, this );
        // Watch out!
        // attachPatternMatched/attachRoutePatternMatched fires for a matched subroute.
        // attachPatternMatched fires for the route's subroutes.
        // attachRoutePatternMatched fires for any matched subroute. i.e. attachPatternMatched/attachRoutePatternMatched fires for no parent routes.
        
        let oViewModel = new JSONModel( {} );
        this.setModel( oViewModel, 'detailModel' );
    }

    DetailController.prototype.onObjectMatched = function( oEvent ) {
        let detailModel         = this.getModel( 'detailModel' ),
            sObjectMatched      = oEvent.getParameters().arguments,
            oGlobalBusyDialog   = new sap.m.BusyDialog();
        
        const sPath = "/Products(" + sObjectMatched.ProductID + ")";

        oGlobalBusyDialog.open();
        this.getModel().read( sPath, {
            
            success: function( oData ) {
                detailModel.setProperty( '/', oData );
                oGlobalBusyDialog.close();
            }.bind( this ),

            error: function( error ) {
                console.error('OData error connection');
                oGlobalBusyDialog.close();
            }
        })

        return sObjectMatched;
    }

    DetailController.prototype.onPressButton = function() {
        // Get the EventBus - first method you use the same method than the previous controller
        // get the EventBus to use the same method from the main controller
        let oEventBus = this.getOwnerComponent().getEventBus();
        // get the onPressButton method out of the EventBus
        oEventBus.publish('onPressButton');
    }

    DetailController.prototype.onPressButton2 = function() {
        // Get the EventBus - second method sendig data through the controllers
        let oEventBus2 = sap.ui.getCore().getEventBus();
        oEventBus2.publish('Detail', 'onPressButton2', { text: 'detail button 2 successfully clicked' } )
    }
    
    return DetailController;

})
