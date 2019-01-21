var gcm = require('node-gcm');
var constants = require('../kbdelicates/constants');
var sender = constants.sender;

//Actual Body
function sendnotification(message,recipient){
	console.log(recipient);
	var message = new gcm.Message( {
	    collapseKey: 'demo',
	    priority: 'high',
	    contentAvailable: true,
	    delayWhileIdle: true,
	    timeToLive: 3,
	    data: {
	        key1: 'message1',
	        key2: 'message2'
	    },
	    notification: {
	        title: "Khanabot",
	        icon: "homeicon",
	        sound:"margun",
	        body: message
	    }
	});

	message.delay_while_idle = 1;
	var registrationIds = [];
	registrationIds.push(recipient);
  console.log("sending notification : ",message);
	//sender.send(message, registrationIds,/* 4,*/ function (err, result) {
	//console.log(result);
	//});
}

//Exports
module.exports = sendnotification;
