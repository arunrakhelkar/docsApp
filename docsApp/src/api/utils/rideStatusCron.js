const Driver = require('../models/driver.model');
const Booking = require('../models/booking.model');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

const rideTime = 5; //Minuets

exports.updateDriverStatusCron = async () => {

	let drivers = await Driver.list({status: 'onRide'});
	console.log(drivers);

	for(driver of drivers){
		
		if(moment(driver.updatedAt).add(rideTime, 'minutes').isBefore(moment())){

			let booking = await Booking.findOne({_id : mongoose.Types.ObjectId(driver.currentRide._id)}).exec();

			driver.status = 'waiting';
			booking.status = 'finished';

			await driver.save();
			await booking.save();
		}
	}
}