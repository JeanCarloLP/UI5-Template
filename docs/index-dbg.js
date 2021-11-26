sap.ui.define([

], function () {
	"use strict";

	// START simple test for ES6
	const myInfo = {
		firstName: "Jean-Carlo",
		city: "Brussels" 
	};

	const hobbies = ['padel', 'warhammer40k', 'comics'];
	let modifiedInfo = { ...myInfo, lastName: 'León', hobbies};
	console.table(modifiedInfo);

	const sayHi = ( name = 'No name') => {
		alert ( `${ name } says HI!!!` );
	}

	sayHi();

	// END simple test for ES6

});