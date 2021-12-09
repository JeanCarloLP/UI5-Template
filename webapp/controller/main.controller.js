

sap.ui.define([
    'sap/ui/demo/template/controller/BaseController',
    'sap/m/MessageToast'
], function( BaseController, MessageToast ) {
    'use strict';

    const MainController = BaseController.extend(
        'sap.ui.demo.template.controller.Main', { 
            constructor: function() {}
        }
    );
    

    MainController.prototype.onInit = function() {
        // Here the OData doesn't have the data yet
        // So if you try let oModel = this.getModel(); yiu will have an error
        BaseController.prototype.onInit.apply( this, arguments );

        // [...]
        // Use the eventOmnce to execute code only when the request of the model completes
        // get the OData model
        let oModel = this.getOwnerComponent().getModel();
        //attach the eventOnce to the OData molde is completed
        oModel.attachEventOnce("requestCompleted", function( oEvent ) {
            // execute your code here
        });

        // So a solution to proceed when you charge your required data is:
        // to use the read method - success callback
        // set the path of the required entity to your model
        let sEntityPath = "/Products";
        // On my view I called the Products entity so thats the one we will try

        // fire the read request callback
        oModel.read(sEntityPath, {
            success: function( oData ) {
                // the data is loaded
                // console.table( oData.results );
                // debugger; // Check oData on the console
            }
        })


        // Get the EventBus - first method
        let oEventBus = this.getOwnerComponent().getEventBus();
        // put the onPress method into the EventBus
        oEventBus.subscribe( 'onPressButton', this.onPressButton, this );
        
        // Get the EventBus - second method
        let oEventBus2 = sap.ui.getCore().getEventBus();
        oEventBus2.subscribe( "Detail", 'onPressButton2', this.onPressButton2, this );
    };

    MainController.prototype.onAfterRendering = function() {
        // let oModel = this.getModel();
        // error to load here the model too, right?
        // Same as inInit
        // Remember the asynchronous nature in SAPUI5
        // it means that some code parts might not get executed or loaded yet

        // Quick demo to use the BaseController with getResourceBundle i18n
        // it was defined on the BaseController
        let testBundle = this.getResourceBundle();
        const title = testBundle.aPropertyFiles[0].mProperties.title;
        // console.info( `This title was setted on the i18n and we access through the Base Controller - title: ${ title } `);
        
    };

    MainController.prototype.onPressButton = () => {
        MessageToast.show( 'Message from Main View: main button successfully clicked' );
    };

    MainController.prototype.onPressButton2 = ( sChanel, sEvent, oData ) => {
        let msg = '';

        if( sEvent === 'onPressButton2' )
            msg = 'Message from '+ sChanel + ' view: ' + oData.text;
        else
            msg = 'Message from Main View: main button 2 successfully clicked';

        MessageToast.show( msg );
    };

    MainController.prototype.onPressItem = function( oEvent ) {
        let sProductID = oEvent.getParameters().listItem.getDescription();
        this.navTo( 'detail', { ProductID: window.encodeURIComponent( sProductID ) } );
    }

    return MainController;
    
});
