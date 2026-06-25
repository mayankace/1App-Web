const Service = require('../models/Service');

/**
 * @desc    Get all services (supports filtering and search)
 * @route   GET /api/services
 */
exports.getAllServices = async (req, res, next) => {
    try {
        const { category, subcategory, search } = req.query;
        const query = { isActive: true };

        if (category) {
            query.category = category;
        }
        if (subcategory) {
            query.subcategory = subcategory;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const services = await Service.find(query);

        res.status(200).json({
            success: true,
            count: services.length,
            data: {
                services
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get single service by ID
 * @route   GET /api/services/:id
 */
exports.getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                service
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get unique service categories and their subcategories
 * @route   GET /api/services/categories
 */
exports.getCategories = async (req, res, next) => {
    try {
        const categoriesData = await Service.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    subcategories: { $addToSet: '$subcategory' }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    subcategories: 1
                }
            },
            { $sort: { category: 1 } }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                categories: categoriesData
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Create service (Admin only)
 * @route   POST /api/services
 */
exports.createService = async (req, res, next) => {
    try {
        // Image URL upload check
        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }

        const serviceData = {
            ...req.body,
            imageUrl
        };

        const service = await Service.create(serviceData);

        res.status(201).json({
            success: true,
            data: {
                service
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Update service (Admin only)
 * @route   PUT /api/services/:id
 */
exports.updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Handle file upload
        if (req.file) {
            req.body.imageUrl = `/uploads/${req.file.filename}`;
        }

        service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: {
                service
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Delete service (soft or hard delete) (Admin only)
 * @route   DELETE /api/services/:id
 */
exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Soft delete: set isActive to false
        service.isActive = false;
        await service.save();

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully (deactivated)'
        });
    } catch (err) {
        next(err);
    }
};
