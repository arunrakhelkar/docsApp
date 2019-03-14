const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env } = require('../../config/vars');

/**
* Driver Status
*/
const status = ['waiting', 'onRide'];

/**
 * Driver Schema
 * @private
 */
const driverSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  status: {
    type: String,
    enum : status,
    default : 'waiting'
  },
  location:{
  },
  currentRide:{

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
driverSchema.pre('save', async function save(next) {
  try {

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
driverSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'phone', 'status','location','currentRide', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

});

/**
 * Statics
 */
driverSchema.statics = {

  /**
   * Get driver
   *
   * @param {ObjectId} id - The objectId of driver.
   * @returns {Promise<Driver, APIError>}
   */
  async get(id) {
    try {
      let driver;

      if (mongoose.Types.ObjectId.isValid(id)) {
        driver = await this.findById(id).exec();
      }
      if (driver) {
        return driver;
      }

      throw new APIError({
        message: 'Driver does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },


  /**
   * List drivers in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of drivers to be skipped.
   * @param {number} limit - Limit number of drivers to be returned.
   * @returns {Promise<Driver[]>}
   */
  list({
    page = 1, perPage = 30, name, email, phone,status
  }) {
    const options = omitBy({ name, email, phone,status }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

};

/**
 * @typedef Driver
 */
module.exports = mongoose.model('Driver', driverSchema);
