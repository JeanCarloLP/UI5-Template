sap.ui.define([

], function () {
	"use strict";
	// This file is just to help you to check the ES6 is working on previous versions of your browser
	// so remember to check the changes of let, const, ... , etc on the compiled files  

	// START simple test for ES6
	const myInfo = {
		firstName: "Jean-Carlo",
		city: "Brussels" 
	};

	const hobbies = ['padel', 'warhammer40k', 'comics'];
	let modifiedInfo = { ...myInfo, lastName: 'León', hobbies};
	console.table(modifiedInfo);

	const sayHi = ( name = 'TheChan') => {
		alert ( `${ name } says HI !!` );
	}

	sayHi();

	// END simple test for ES6

});