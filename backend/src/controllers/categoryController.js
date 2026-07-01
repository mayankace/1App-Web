const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// ─── CATEGORY ────────────────────────────────────────────────────────────────

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        res.status(200).json({ success: true, count: categories.length, data: { categories } });
    } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create({ name: req.body.name });
        res.status(201).json({ success: true, data: { category } });
    } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true, runValidators: true });
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, data: { category } });
    } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        category.isActive = false;
        await category.save();
        res.status(200).json({ success: true, message: 'Category deactivated successfully' });
    } catch (err) { next(err); }
};

// ─── SUBCATEGORY ─────────────────────────────────────────────────────────────

exports.getAllSubCategories = async (req, res, next) => {
    try {
        const filter = { isActive: true };
        if (req.query.category) filter.category = req.query.category;
        const subcategories = await SubCategory.find(filter).populate('category', 'name').sort({ name: 1 });
        res.status(200).json({ success: true, count: subcategories.length, data: { subcategories } });
    } catch (err) { next(err); }
};

exports.createSubCategory = async (req, res, next) => {
    try {
        const subcategory = await SubCategory.create({ name: req.body.name, category: req.body.categoryId });
        await subcategory.populate('category', 'name');
        res.status(201).json({ success: true, data: { subcategory } });
    } catch (err) { next(err); }
};

exports.updateSubCategory = async (req, res, next) => {
    try {
        const update = {};
        if (req.body.name) update.name = req.body.name;
        if (req.body.categoryId) update.category = req.body.categoryId;
        const subcategory = await SubCategory.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).populate('category', 'name');
        if (!subcategory) return res.status(404).json({ success: false, message: 'SubCategory not found' });
        res.status(200).json({ success: true, data: { subcategory } });
    } catch (err) { next(err); }
};

exports.deleteSubCategory = async (req, res, next) => {
    try {
        const subcategory = await SubCategory.findById(req.params.id);
        if (!subcategory) return res.status(404).json({ success: false, message: 'SubCategory not found' });
        subcategory.isActive = false;
        await subcategory.save();
        res.status(200).json({ success: true, message: 'SubCategory deactivated successfully' });
    } catch (err) { next(err); }
};
