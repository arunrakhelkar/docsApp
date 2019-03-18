const express = require('express');
const driverRoutes = require('./driver.route');
const userRoutes = require('./user.route');
const bookingRoutes = require('./booking.route');
const path = require('path');
const User = require('../../models/user.model');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/*
 * Rendering app views
 */
// let users = [
// 	"id1","id2"
// ]
router.get('/customer-app', async (req, res) =>{
	res.render(path.join(__dirname +'../../../../views/' + 'customer.html'));
});


router.get('/driver-app', (req, res) =>{
	res.render(path.join(__dirname +'../../../../views/' + 'driver.html'));
});


router.get('/dashboard-app', (req, res) =>{
	res.render(path.join(__dirname + '../../../../views/' + 'dashboard.html'));
});

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/driver', driverRoutes);
router.use('/booking',bookingRoutes);

module.exports = router;
