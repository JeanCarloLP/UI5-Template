"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

sap.ui.define([], function () {
  "use strict"; // This file is just to help you to check the ES6 is working on previous versions of your browser
  // so remember to check the changes of let, const, ... , etc on the compiled files 
  // START simple test for ES6

  var myInfo = {
    firstName: "Jean",
    city: "Brussels"
  };
  var hobbies = ['padel', 'warhammer40k', 'comics'];

  var modifiedInfo = _objectSpread(_objectSpread({}, myInfo), {}, {
    lastName: 'León',
    hobbies: hobbies
  });

  var sayHi = function sayHi(name) {
    if (myInfo.firstName) name = myInfo.firstName;else name = 'No name';
    alert("".concat(name, " says HI!!!"));
  };

  return new Promise(function (resolve, reject) {
    if (myInfo.firstName === 'Jean') {
      resolve(sayHi());
    } else {
      reject("The required info doesn't exist");
    }
  }); // END simple test for ES6
});