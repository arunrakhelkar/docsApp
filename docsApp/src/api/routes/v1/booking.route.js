const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/booking.controller');

const router = express.Router();

/**
 * Load booking when API with bookingId route parameter is hit
 */
router.param('bookingId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/bookings List Bookings
   * @apiDescription Get a list of bookings
   * @apiVersion 1.0.0
   * @apiName ListBookings
   * @apiGroup Booking
   * @apiPermission admin
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Bookings per page
   * @apiParam  {String}             [name]       Booking's name
   * @apiParam  {String}             [email]      Booking's email
   * @apiParam  {String=booking,admin}  [role]       Booking's role
   *
   * @apiSuccess {Object[]} bookings List of bookings.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(controller.list)
  /**
   * @api {post} v1/bookings Create Booking
   * @apiDescription Create a new booking
   * @apiVersion 1.0.0
   * @apiName CreateBooking
   * @apiGroup Booking
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Booking's access token
   *
   * @apiParam  {String}             email     Booking's email
   * @apiParam  {String{6..128}}     password  Booking's password
   * @apiParam  {String{..128}}      [name]    Booking's name
   *
   * @apiSuccess (Created 201) {String}  id         Booking's id
   * @apiSuccess (Created 201) {String}  name       Booking's name
   * @apiSuccess (Created 201) {String}  email      Booking's email
   * @apiSuccess (Created 201) {String}  role       Booking's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated bookings can create the data
   */
  .post( controller.create);


router
  .route('/:bookingId')
  /**
   * @api {get} v1/bookings/:id Get Booking
   * @apiDescription Get booking information
   * @apiVersion 1.0.0
   * @apiName GetBooking
   * @apiGroup Booking
   * @apiPermission booking
   *
   * @apiHeader {String} Authorization   Booking's access token
   *
   * @apiSuccess {String}  id         Booking's id
   * @apiSuccess {String}  name       Booking's name
   * @apiSuccess {String}  email      Booking's email
   * @apiSuccess {String}  role       Booking's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated bookings can access the data
   * @apiError (Forbidden 403)    Forbidden    Only booking with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Booking does not exist
   */
  .get(controller.get)
  /**
   * @api {put} v1/bookings/:id Replace Booking
   * @apiDescription Replace the whole booking document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceBooking
   * @apiGroup Booking
   * @apiPermission booking
   *
   * @apiHeader {String} Authorization   Booking's access token
   *
   * @apiParam  {String}             email     Booking's email
   * @apiParam  {String{6..128}}     password  Booking's password
   * @apiParam  {String{..128}}      [name]    Booking's name
   * @apiParam  {String=booking,admin}  [role]    Booking's role
   * (You must be an admin to change the booking's role)
   *
   * @apiSuccess {String}  id         Booking's id
   * @apiSuccess {String}  name       Booking's name
   * @apiSuccess {String}  email      Booking's email
   * @apiSuccess {String}  role       Booking's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated bookings can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only booking with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Booking does not exist
   */
  .put( controller.replace)
  /**
   * @api {patch} v1/bookings/:id Update Booking
   * @apiDescription Update some fields of a booking document
   * @apiVersion 1.0.0
   * @apiName UpdateBooking
   * @apiGroup Booking
   * @apiPermission booking
   *
   * @apiHeader {String} Authorization   Booking's access token
   *
   * @apiParam  {String}             email     Booking's email
   * @apiParam  {String{6..128}}     password  Booking's password
   * @apiParam  {String{..128}}      [name]    Booking's name
   * @apiParam  {String=booking,admin}  [role]    Booking's role
   * (You must be an admin to change the booking's role)
   *
   * @apiSuccess {String}  id         Booking's id
   * @apiSuccess {String}  name       Booking's name
   * @apiSuccess {String}  email      Booking's email
   * @apiSuccess {String}  role       Booking's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated bookings can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only booking with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Booking does not exist
   */
  .patch( controller.update)
  /**
   * @api {patch} v1/bookings/:id Delete Booking
   * @apiDescription Delete a booking
   * @apiVersion 1.0.0
   * @apiName DeleteBooking
   * @apiGroup Booking
   * @apiPermission booking
   *
   * @apiHeader {String} Authorization   Booking's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated bookings can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only booking with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Booking does not exist
   */
  .delete(controller.remove);


module.exports = router;
