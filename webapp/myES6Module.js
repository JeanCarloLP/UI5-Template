sap.ui.define([

], function () {
	"use strict";
    // This file is just to help you to check the ES6 is working on previous versions of your browser
	// so remember to check the changes of let, const, ... , etc on the compiled files 

	// START simple test for ES6
	const myInfo = {
		firstName: "Jean",
		city: "Brussels" 
	};

	const hobbies = ['padel', 'warhammer40k', 'comics'];
	let modifiedInfo = {...myInfo, lastName: 'León', hobbies};
	console.table( modifiedInfo );

	const sayHi = ( name ) => {
        if( myInfo.firstName )
            name = myInfo.firstName;
        else
            name = 'No name';

		alert ( `${ name } says HI!!!` );
	}

	return new Promise( ( resolve, reject ) => {
        if( myInfo.firstName === 'Jean' ) {
            resolve( sayHi() );
        } else {
            reject( `The required info doesn't exist` );
        }
    });

	// END simple test for ES6

});