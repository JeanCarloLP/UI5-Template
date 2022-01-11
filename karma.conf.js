

module.exports = function( config ) {
    config.set({
        frameworks: ["ui5"],
        ui5: {
            configPath: "ui5.yaml",
            mode: "script",
            config: {
                bindingSyntax: "complex",
                compatVersion: "edge",
                async: true,
                resourceRoots: {
                    "sap.ui.library.reuse": ".base/webapp/ui5-library-reuse"
                }
            },
            tests: []
        },
        reporters: ["progress"],
        browsers: ["Chrome"],
        singleRun: false
    });
};
