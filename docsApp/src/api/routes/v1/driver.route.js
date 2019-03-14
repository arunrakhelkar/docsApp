const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/driver.controller');

const router = express.Router();

/**
 * Load driver when API with driverId route parameter is hit
 */
router.param('driverId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/drivers List Drivers
   * @apiDescription Get a list of drivers
   * @apiVersion 1.0.0
   * @apiName ListDrivers
   * @apiGroup Driver
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Driver's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Drivers per page
   * @apiParam  {String}             [name]       Driver's name
   * @apiParam  {String}             [email]      Driver's email
   
   *
   * @apiSuccess {Object[]} drivers List of drivers.
   *
   */
  .get(controller.list)
  /**
   * @api {post} v1/drivers Create Driver
   * @apiDescription Create a new driver
   * @apiVersion 1.0.0
   * @apiName CreateDriver
   * @apiGroup Driver
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Driver's access token
   *
   * @apiParam  {String}             email     Driver's email
   * @apiParam  {String{6..128}}     password  Driver's password
   * @apiParam  {String{..128}}      [name]    Driver's name
   
   *
   * @apiSuccess (Created 201) {String}  id         Driver's id
   * @apiSuccess (Created 201) {String}  name       Driver's name
   * @apiSuccess (Created 201) {String}  email      Driver's email
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   */
  .post( controller.create);


router
  .route('/:driverId')
  /**
   * @api {get} v1/drivers/:id Get Driver
   * @apiDescription Get driver information
   * @apiVersion 1.0.0
   * @apiName GetDriver
   * @apiGroup Driver
   * @apiPermission driver
   *
   * @apiHeader {String} Authorization   Driver's access token
   *
   * @apiSuccess {String}  id         Driver's id
   * @apiSuccess {String}  name       Driver's name
   * @apiSuccess {String}  email      Driver's email
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Not Found 404)    NotFound     Driver does not exist
   */
  .get(controller.get)
  /**
   * @api {put} v1/drivers/:id Replace Driver
   * @apiDescription Replace the whole driver document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceDriver
   * @apiGroup Driver
   * @apiPermission driver
   *
   * @apiHeader {String} Authorization   Driver's access token
   *
   * @apiParam  {String}             email     Driver's email
   * @apiParam  {String{6..128}}     password  Driver's password
   * @apiParam  {String{..128}}      [name]    Driver's name
   *
   * @apiSuccess {String}  id         Driver's id
   * @apiSuccess {String}  name       Driver's name
   * @apiSuccess {String}  email      Driver's email
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values\
   * @apiError (Not Found 404)    NotFound     Driver does not exist
   */
  .put( controller.replace)
  /**
   * @api {patch} v1/drivers/:id Update Driver
   * @apiDescription Update some fields of a driver document
   * @apiVersion 1.0.0
   * @apiName UpdateDriver
   * @apiGroup Driver
   * @apiPermission driver
   *
   * @apiHeader {String} Authorization   Driver's access token
   *
   * @apiParam  {String}             email     Driver's email
   * @apiParam  {String{6..128}}     password  Driver's password
   * @apiParam  {String{..128}}      [name]    Driver's name
   *
   * @apiSuccess {String}  id         Driver's id
   * @apiSuccess {String}  name       Driver's name
   * @apiSuccess {String}  email      Driver's email
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Not Found 404)    NotFound     Driver does not exist
   */
  .patch( controller.update)
  /**
   * @api {patch} v1/drivers/:id Delete Driver
   * @apiDescription Delete a driver
   * @apiVersion 1.0.0
   * @apiName DeleteDriver
   * @apiGroup Driver
   * @apiPermission driver
   *
   * @apiHeader {String} Authorization   Driver's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated drivers can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only driver with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Driver does not exist
   */
  .delete(controller.remove);

  
router
  .route('/:driverId/booking')
  .get(controller.getBookingRequests)

router
  .route('/:driverId/booking/:bookingId/accept')
  .post(controller.acceptBooking)

module.exports = router;
