const express = require('express');
const setupController = require('../controllers/setupController');

const router = express.Router();

/**
 * Setup Routes
 * Handles initial system setup and configuration
 */

/**
 * @route GET /api/setup/status
 * @desc Check if initial setup is needed
 * @access Public (no auth required for setup check)
 */
router.get('/status', setupController.checkSetupNeeded);

/**
 * @route POST /api/setup/admin
 * @desc Create initial admin user
 * @access Public (only works when no admins exist)
 */
router.post('/admin', setupController.createInitialAdmin);

/**
 * @route POST /api/setup/complete
 * @desc Mark setup as complete
 * @access Public (verification only)
 */
router.post('/complete', setupController.completeSetup);

/**
 * @route DELETE /api/setup/reset
 * @desc Reset setup (development only)
 * @access Public (development only)
 */
router.delete('/reset', setupController.resetSetup);

module.exports = router;