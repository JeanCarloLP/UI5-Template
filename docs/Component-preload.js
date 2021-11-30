//@ui5-bundle sap/ui/demo/template/Component-preload.js
sap.ui.require.preload({
	"sap/ui/demo/template/Component.js":function(){"use strict";sap.ui.define([]);
},
	"sap/ui/demo/template/i18n/i18n.properties":'\nappTitle=SAPUI5 Template\nappDescription=App Template to implement your own project',
	"sap/ui/demo/template/i18n/i18n_en.properties":'\nappTitle=SAPUI5 Template\nappDescription=App Template to implement your own project',
	"sap/ui/demo/template/index.js":function(){"use strict";sap.ui.define(["sap/ui/demo/template/myES6Module"],function(e){"use strict";e.then(function(){sap.ui.require(["sap/ui/core/ComponentSupport"])})});
},
	"sap/ui/demo/template/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"sap.ui.demo.template","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"}},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.template.view.app","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.60","libs":{"sap.m":{},"sap.ui.core":{},"sap.ui.layout":{}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.template.i18n.i18n","supportedLocales":[""],"fallbackLocale":""}},"invoice":{"type":"sap.ui.model.json.JSONModel","uri":"assets/Invoices.json"}},"resources":{"css":[{"uri":"css/style.css"}]}}}',
	"sap/ui/demo/template/myES6Module.js":'"use strict";function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);if(r){n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})}t.push.apply(t,n)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=arguments[r]!=null?arguments[r]:{};if(r%2){ownKeys(Object(t),true).forEach(function(r){_defineProperty(e,r,t[r])})}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(e,Object.getOwnPropertyDescriptors(t))}else{ownKeys(Object(t)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}}return e}function _defineProperty(e,r,t){if(r in e){Object.defineProperty(e,r,{value:t,enumerable:true,configurable:true,writable:true})}else{e[r]=t}return e}sap.ui.define([],function(){"use strict";var e={firstName:"Jean",city:"Brussels"};var r=["padel","warhammer40k","comics"];var t=_objectSpread(_objectSpread({},e),{},{lastName:"León",hobbies:r});var n=function r(t){if(e.firstName)t=e.firstName;else t="No name";alert("".concat(t," says HI!!!"))};return new Promise(function(r,t){if(e.firstName==="Jean"){r(n())}else{t("The required info doesn\'t exist")}})});'
});
