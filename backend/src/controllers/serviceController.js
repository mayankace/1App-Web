const Service = require('../models/Service');

/**
 * @desc    Get all services (supports filtering and search)
 * @route   GET /api/services
 */
exports.getAllServices = async (req, res, next) => {
    try {
        const { serviceName, name, category, subcategory, search } = req.query;
        const query = { isActive: true };
        const selectedServiceName = serviceName || name;

        if (selectedServiceName) {
            query.name = selectedServiceName;
        }
        if (category) {
            query.category = category;
        }
        if (subcategory) {
            query.subcategory = subcategory;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { subcategory: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const services = await Service.find(query).sort({ name: 1, category: 1, subcategory: 1 });

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
 * @desc    Get unique service names, categories, and subcategories
 * @route   GET /api/services/categories
 */
exports.getCategories = async (req, res, next) => {
    try {
        const categoriesData = await Service.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: {
                        serviceName: '$name',
                        category: '$category'
                    },
                    subcategories: { $addToSet: '$subcategory' }
                }
            },
            { $sort: { '_id.category': 1 } },
            {
                $group: {
                    _id: '$_id.serviceName',
                    categories: {
                        $push: {
                            category: '$_id.category',
                            subcategories: '$subcategories'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    serviceName: '$_id',
                    name: '$_id',
                    categories: 1,
                    category: '$_id',
                    subcategories: {
                        $map: {
                            input: '$categories',
                            as: 'item',
                            in: '$$item.category'
                        }
                    }
                }
            },
            { $sort: { serviceName: 1 } }
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

/**
 * @desc    Get service hierarchy (service names -> categories -> subcategories)
 * @route   GET /api/services/hierarchy
 */
exports.getServiceHierarchy = async (req, res, next) => {
    try {
        const services = await Service.find({ isActive: true });

        const hierarchy = {};
        services.forEach(service => {
            if (!hierarchy[service.name]) {
                hierarchy[service.name] = {
                    categories: {}
                };
            }
            if (service.category && service.category !== 'General') {
                if (!hierarchy[service.name].categories[service.category]) {
                    hierarchy[service.name].categories[service.category] = [];
                }
                if (service.subcategory && service.subcategory !== 'General') {
                    if (!hierarchy[service.name].categories[service.category].includes(service.subcategory)) {
                        hierarchy[service.name].categories[service.category].push(service.subcategory);
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            data: {
                hierarchy
            }
        });
    } catch (err) {
        next(err);
    }
};
