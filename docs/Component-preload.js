//@ui5-bundle sap/ui/demo/walkthrough/Component-preload.js
sap.ui.require.preload({
	"sap/ui/demo/walkthrough/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","./controller/HelloDialog"],function(o,e,t){"use strict";return o.extend("sap.ui.demo.walkthrough.Component",{metadata:{interfaces:["sap.ui.core.IAsyncContentCreation"],manifest:"json"},init:function(){o.prototype.init.apply(this,arguments);var i={recipient:{name:"World"}};var n=new e(i);this.setModel(n);this.rootControlLoaded().then(function(){this._helloDialog=new t(this.getRootControl())}.bind(this))},exit:function(){if(this._helloDialog){this._helloDialog.destroy();delete this._helloDialog}},openHelloDialog:function(){this._helloDialog.open()}})});
},
	"sap/ui/demo/walkthrough/i18n/i18n.properties":'',
	"sap/ui/demo/walkthrough/i18n/i18n_en.properties":'',
	"sap/ui/demo/walkthrough/index.js":function(){sap.ui.define([],function(){"use strict";const e={firstName:"Jean-Carlo",city:"Brussels"};const s=["padel","warhammer40k","comics"];let a={...e,lastName:"León",hobbies:s};console.table(a);const t=(e="No name")=>{alert(`${e} says HI!!!`)};t()});
},
	"sap/ui/demo/walkthrough/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"sap.ui.demo.walkthrough","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"}},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.walkthrough.view.app","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.60","libs":{"sap.m":{}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.walkthrough.i18n.i18n","supportedLocales":[""],"fallbackLocale":""}},"invoice":{"type":"sap.ui.model.json.JSONModel","uri":"assets/Invoices.json"}},"resources":{"css":[{"uri":"css/style.css"}]}}}'
});
