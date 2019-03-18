const httpStatus = require('http-status');
const { omit } = require('lodash');
const Driver = require('../models/driver.model');
const Booking = require('../models/booking.model');
const mongoose = require('mongoose');

/**
 * Load driver and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const driver = await Driver.get(id);
    req.locals = { driver };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get driver
 * @public
 */
exports.get = (req, res) => res.json(req.locals.driver.transform());

/**
 * Create new driver
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const driver = new Driver(req.body);
    const savedDriver = await driver.save();
    res.status(httpStatus.CREATED);
    res.json(savedDriver.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing driver
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { driver } = req.locals;
    const newDriver = new Driver(req.body);
    const ommitRole = driver.role !== 'admin' ? 'role' : '';
    const newDriverObject = omit(newDriver.toObject(), '_id', ommitRole);

    await driver.update(newDriverObject, { override: true, upsert: true });
    const savedDriver = await Driver.findById(driver._id);

    res.json(savedDriver.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing driver
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.driver.role !== 'admin' ? 'role' : '';
  const updatedDriver = omit(req.body, ommitRole);
  const driver = Object.assign(req.locals.driver, updatedDriver);

  driver.save()
    .then(savedDriver => res.json(savedDriver.transform()))
    .catch(e => next(e));
};

/**
 * Get driver list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const drivers = await Driver.list(req.query);
    const transformedDrivers = drivers.map(driver => driver.transform());
    res.json(transformedDrivers);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete driver
 * @public
 */
exports.remove = (req, res, next) => {
  const { driver } = req.locals;

  driver.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};

/**
* Driver Get Booking Requests
* @public
*/

exports.getBookingRequests = async (req,res,next) => {
  try{
    let bookings = await Booking.find({broadCastBookingList : mongoose.Types.ObjectId(req.params.driverId)}).exec();
    console.log(bookings)
    res.status(httpStatus.OK).send(bookings);
  }catch(error){
    next(error)
  }
}

exports.acceptBooking = async (req,res,next) => {
  try{
    let booking = await Booking.findOne({_id : mongoose.Types.ObjectId(req.params.bookingId)}).exec();

    let {driver} = req.locals;

    if( driver && driver.status === 'onRide'){
      res.status(httpStatus.METHOD_NOT_ALLOWED).send({message : 'Driver is already on ride.'})
      return;
    }
    if(booking && booking.status === 'waiting'){
      
      driver.status = 'onRide';
      driver.currentRide = req.params.bookingId;

      booking.broadCastBookingList = [];
      booking.assignedDriver = req.params.driverId;
      booking.status = 'onRide'

      await driver.save();
      await booking.save();
      
      res.status(httpStatus.OK).send({message : 'Assigned Driver to this booking'});
    } else {

      res.status(httpStatus.METHOD_NOT_ALLOWED).send({message : 'Booking already assigned to another driver'});
    }
    
  }catch(error){
    next(error)
  } 
}