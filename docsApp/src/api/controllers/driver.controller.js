const httpStatus = require('http-status');
const { omit } = require('lodash');
const Driver = require('../models/driver.model');
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
    next(Driver.checkDuplicateEmail(error));
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
    next(Driver.checkDuplicateEmail(error));
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
    .catch(e => next(Driver.checkDuplicateEmail(e)));
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

