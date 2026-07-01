const Service = require('../models/Service');

const POPULATE = [
    { path: 'category', select: 'name' },
    { path: 'subcategory', select: 'name category' }
];

exports.getAllServices = async (req, res, next) => {
    try {
        const { category, subcategory, search } = req.query;
        const query = { isActive: true };

        if (category) query.category = category;
        if (subcategory) query.subcategory = subcategory;

        let services = await Service.find(query).populate(POPULATE).sort({ name: 1 });

        if (search) {
            const s = search.toLowerCase();
            services = services.filter(svc =>
                svc.name?.toLowerCase().includes(s) ||
                svc.category?.name?.toLowerCase().includes(s) ||
                svc.subcategory?.name?.toLowerCase().includes(s) ||
                svc.description?.toLowerCase().includes(s)
            );
        }

        res.status(200).json({ success: true, count: services.length, data: { services } });
    } catch (err) { next(err); }
};

exports.getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id).populate(POPULATE);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, data: { service } });
    } catch (err) { next(err); }
};

exports.createService = async (req, res, next) => {
    try {
        let imageUrl = '';
        if (req.file) imageUrl = `/uploads/${req.file.filename}`;
        else if (req.body.imageUrl) imageUrl = req.body.imageUrl;

        const service = await Service.create({ ...req.body, imageUrl });
        await service.populate(POPULATE);

        res.status(201).json({ success: true, data: { service } });
    } catch (err) { next(err); }
};

exports.updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

        if (req.file) req.body.imageUrl = `/uploads/${req.file.filename}`;

        service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(POPULATE);
        res.status(200).json({ success: true, data: { service } });
    } catch (err) { next(err); }
};

exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        service.isActive = false;
        await service.save();
        res.status(200).json({ success: true, message: 'Service deleted successfully (deactivated)' });
    } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
    try {
        const Category = require('../models/Category');
        const SubCategory = require('../models/SubCategory');
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        const subcategories = await SubCategory.find({ isActive: true }).populate('category', 'name').sort({ name: 1 });
        res.status(200).json({ success: true, data: { categories, subcategories } });
    } catch (err) { next(err); }
};

exports.getServiceHierarchy = async (req, res, next) => {
    try {
        const services = await Service.find({ isActive: true }).populate(POPULATE);
        const hierarchy = {};
        services.forEach(svc => {
            const catName = svc.category?.name || 'General';
            const subName = svc.subcategory?.name || 'General';
            if (!hierarchy[catName]) hierarchy[catName] = {};
            if (!hierarchy[catName][subName]) hierarchy[catName][subName] = [];
            hierarchy[catName][subName].push({ id: svc._id, name: svc.name });
        });
        res.status(200).json({ success: true, data: { hierarchy } });
    } catch (err) { next(err); }
};
