"use strict";function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);if(r){n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})}t.push.apply(t,n)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=arguments[r]!=null?arguments[r]:{};if(r%2){ownKeys(Object(t),true).forEach(function(r){_defineProperty(e,r,t[r])})}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(e,Object.getOwnPropertyDescriptors(t))}else{ownKeys(Object(t)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}}return e}function _defineProperty(e,r,t){if(r in e){Object.defineProperty(e,r,{value:t,enumerable:true,configurable:true,writable:true})}else{e[r]=t}return e}sap.ui.define([],function(){"use strict";var e={firstName:"Jean",city:"Brussels"};var r=["padel","warhammer40k","comics"];var t=_objectSpread(_objectSpread({},e),{},{lastName:"León",hobbies:r});var n=function r(t){if(e.firstName)t=e.firstName;else t="No name";alert("".concat(t," says HI!!!"))};return new Promise(function(r,t){if(e.firstName==="Jean"){r(n())}else{t("The required info doesn't exist")}})});