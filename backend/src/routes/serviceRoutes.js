const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateService } = require('../middleware/validation');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/categories', serviceController.getCategories);
router.get('/:id', serviceController.getServiceById);

// Admin-only routes (protected)
router.post(
    '/',
    protect,
    restrictTo('admin'),
    upload.single('image'),
    validateService,
    serviceController.createService
);

router.put(
    '/:id',
    protect,
    restrictTo('admin'),
    upload.single('image'),
    serviceController.updateService
);

router.delete(
    '/:id',
    protect,
    restrictTo('admin'),
    serviceController.deleteService
);

module.exports = router;
