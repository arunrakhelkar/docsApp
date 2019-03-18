const httpStatus = require('http-status');
const { omit } = require('lodash');
const Booking = require('../models/booking.model');
const Driver = require('../models/driver.model')
const mongoose = require('mongoose');

/**
 * Load booking and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const booking = await Booking.get(id);
    req.locals = { booking };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get booking
 * @public
 */
exports.get = (req, res) => res.json(req.locals.booking.transform());

/**
 * Create new booking
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const booking = new Booking(req.body);
    let drivers = await Driver.list({});
    console.log(drivers)
    drivers = drivers.map(driver => driver._id);
    booking.broadCastBookingList = drivers;
    const savedBooking = await booking.save();
    res.status(httpStatus.CREATED);
    res.json(savedBooking.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing booking
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { booking } = req.locals;
    const newBooking = new Booking(req.body);
    const ommitRole = booking.role !== 'admin' ? 'role' : '';
    const newBookingObject = omit(newBooking.toObject(), '_id', ommitRole);

    await booking.update(newBookingObject, { override: true, upsert: true });
    const savedBooking = await Booking.findById(booking._id);

    res.json(savedBooking.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing booking
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.booking.role !== 'admin' ? 'role' : '';
  const updatedBooking = omit(req.body, ommitRole);
  const booking = Object.assign(req.locals.booking, updatedBooking);

  booking.save()
    .then(savedBooking => res.json(savedBooking.transform()))
    .catch(e => next(e));
};

/**
 * Get booking list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const bookings = await Booking.list(req.query);
    const transformedBookings = bookings.map(booking => booking.transform());
    res.json(transformedBookings);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete booking
 * @public
 */
exports.remove = (req, res, next) => {
  const { booking } = req.locals;

  booking.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
