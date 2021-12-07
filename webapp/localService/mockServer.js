

sap.ui.define([
    "sap/ui/core/util/MockServer"
], function( MockServer, Log ) {
    "use strict";

    let oMockServer,
        sAppModulePath = 'sap/ui/demo/template/',
        sJSONFilesModulePath = sAppModulePath + 'localService/mockData';

    return {
        /**
         * Initialize the mock server.
         * You can configure the delay with the URL parameter "serverDelay".
         * The local mock data in this folder is returned instead of the real data for testing the new implementations
         */
        
        init: function() {
            let oUriParameters  = jQuery.sap.getUriParameters(),
                sJSONFilesUrl   = jQuery.sap.getModulePath( sJSONFilesModulePath ),
                sManifestUrl    = jQuery.sap.getModulePath( sAppModulePath + 'manifest', '.json' ),
                sEntity         = '/Product',
                sErrorParams    = oUriParameters.get('errorType'),
                iErrorCode      = sErrorParams === 'badRequest' ? 400 : 500,
                oManifest       = jQuery.sap.syncGetJSON( sManifestUrl ).data,
                oMainDataSource = oManifest["sap.app"].dataSources.mainService,
                sMetaDataUrl    = jQuery.sap.getModulePath( sAppModulePath + oMainDataSource.settings.localUri.replace( ".xml", "" ), ".xml" ),
                sMockServerUrl  = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri
                                                                    : oMainDataSource.uri + "/";

            oMockServer = new MockServer({
                rootUri: sMockServerUrl
            });

            MockServer.config({
                autoRespond: true,
                autoRespondAfter: oUriParameters.get( 'serverDelay' ) || 1000
            });

            oMockServer.simulate( sMetaDataUrl, {
                sMockdataBaseUrl: sJSONFilesUrl,
                bGenerateMissingMockData: true
            });

            let aRequests = oMockServer.getRequests(),
                fnResponse = ( iErrCode, sMessage, aRequests ) => {
                    aRequests.response = ( oXhr ) => {
                        oXhr.respond( iErrCode, { "Content-Type": "test/plain:charset=utf-8" }, sMessage );
                    }
                };
            
            // handling the metadata error test
            if( oUriParameters.get( "metadataError" ) ) {
                aRequests.forEach( ( aEntry ) => {
                    if( aEntry.path.toString().indexOf( "$metadata" ) > -1 )
                        fnResponse( 500, "metadata Error", aEntry );
                });
            }

            // handling request errors
            if( sErrorParams ) {
                aRequests.forEach( ( aEntry ) => {
                    if( aEntry.path.toString().indexOf( sEntity ) > -1 )
                        fnResponse( iErrorCode, sErrorParams, aEntry );
                });
            }

            oMockServer.setRequests( aRequests );
            oMockServer.start();

            // console.info( "Running the app with mock data." );
        },

        /**
         * return the Mock Server of the App, this should be use in the Integration and Unit test 
         */
        getMockServer: function() {
            return oMockServer;
        }
    }
});
