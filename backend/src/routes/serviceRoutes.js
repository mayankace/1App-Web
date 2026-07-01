const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const categoryController = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateService } = require('../middleware/validation');

// ─── CATEGORY ROUTES ─────────────────────────────────────────────────────────
router.get('/categories', categoryController.getAllCategories);
router.post('/categories', protect, restrictTo('admin'), categoryController.createCategory);
router.put('/categories/:id', protect, restrictTo('admin'), categoryController.updateCategory);
router.delete('/categories/:id', protect, restrictTo('admin'), categoryController.deleteCategory);

// ─── SUBCATEGORY ROUTES ───────────────────────────────────────────────────────
router.get('/subcategories', categoryController.getAllSubCategories);
router.post('/subcategories', protect, restrictTo('admin'), categoryController.createSubCategory);
router.put('/subcategories/:id', protect, restrictTo('admin'), categoryController.updateSubCategory);
router.delete('/subcategories/:id', protect, restrictTo('admin'), categoryController.deleteSubCategory);

// ─── SERVICE ROUTES ───────────────────────────────────────────────────────────
router.get('/hierarchy', serviceController.getServiceHierarchy);
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

router.post('/', protect, restrictTo('admin'), upload.single('image'), validateService, serviceController.createService);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), serviceController.updateService);
router.delete('/:id', protect, restrictTo('admin'), serviceController.deleteService);

module.exports = router;
