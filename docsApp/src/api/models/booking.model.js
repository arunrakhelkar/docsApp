const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
* Booking Status
*/
const status = ['waiting', 'onRide','finished','cancelled'];

/**
 * Booking Schema
 * @private
 */
const bookingSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required : true
  },
  assignedDriver:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  broadCastBookingList :[{type: [mongoose.Schema.ObjectId], ref: 'Driver',default:[]}],
  status:{
    type: String,
    enum : status,
    default : 'waiting'
  },
  location:{

  }
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
bookingSchema.pre('save', async function save(next) {
  try {

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
bookingSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'user', 'assignedDriver', 'broadCastBookingList', 'location','createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
bookingSchema.statics = {

  /**
   * Get booking
   *
   * @param {ObjectId} id - The objectId of booking.
   * @returns {Promise<Booking, APIError>}
   */
  async get(id) {
    try {
      let booking;

      if (mongoose.Types.ObjectId.isValid(id)) {
        booking = await this.findById(id).populate('assignedDriver').populate('broadCastBookingList').exec();
      }
      if (booking) {
        return booking;
      }

      throw new APIError({
        message: 'Booking does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },


  /**
   * List bookings in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of bookings to be skipped.
   * @param {number} limit - Limit number of bookings to be returned.
   * @returns {Promise<Booking[]>}
   */
  list({
    page = 1, perPage = 30, user, assignedDriver, status
  }) {
    const options = omitBy({ user, assignedDriver, status }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .populate('assignedDriver').populate('broadCastBookingList')
      .exec();
  },

};

/**
 * @typedef Booking
 */
module.exports = mongoose.model('Booking', bookingSchema);
