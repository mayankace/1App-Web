import React, { useEffect, useState } from 'react';
import adminApi from '../services/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    FaPlus, FaEdit, FaTrash, FaLayerGroup, FaRupeeSign,
    FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const SubcategoryManagement = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [serviceNames, setServiceNames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form fields
    const [selectedService, setSelectedService] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategoryName, setSubcategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const servicesRes = await adminApi.getServices();
            if (servicesRes.success) {
                // Get unique service names
                const uniqueServices = servicesRes.data.services.reduce((acc, service) => {
                    if (!acc.find(s => s.name === service.name)) {
                        acc.push({
                            _id: service._id,
                            name: service.name
                        });
                    }
                    return acc;
                }, []);
                setServiceNames(uniqueServices);

                // Get unique categories with their service association
                const categoryMap = {};
                const subcategoryList = [];
                servicesRes.data.services.forEach(service => {
                    if (service.category && service.category !== 'General') {
                        const key = `${service.name}|${service.category}`;
                        if (!categoryMap[key]) {
                            categoryMap[key] = {
                                serviceName: service.name,
                                category: service.category
                            };
                        }
                    }

                    // Collect subcategories
                    if (service.subcategory && service.subcategory !== 'General') {
                        subcategoryList.push({
                            id: service._id,
                            serviceName: service.name,
                            category: service.category,
                            subcategory: service.subcategory,
                            description: service.description || '',
                            price: service.price || 0,
                            duration: service.duration || 30,
                            imageUrl: service.imageUrl || '',
                            isActive: service.isActive
                        });
                    }
                });
                setCategories(Object.values(categoryMap));
                setSubcategories(subcategoryList);
            }
        } catch (err) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Update categories when service changes
    useEffect(() => {
        if (selectedService) {
            const filteredCategories = categories.filter(c => c.serviceName === selectedService);
            // Reset category selection
            if (filteredCategories.length === 0) {
                setSelectedCategory('');
            } else if (!filteredCategories.find(c => c.category === selectedCategory)) {
                setSelectedCategory('');
            }
        }
    }, [selectedService, categories]);

    const handleOpenCreate = () => {
        setEditingId(null);
        setSelectedService('');
        setSelectedCategory('');
        setSubcategoryName('');
        setDescription('');
        setPrice('');
        setDuration('');
        setImageUrl('');
        setImageFile(null);
        setShowForm(true);
    };

    const handleOpenEdit = (subcategory) => {
        setEditingId(subcategory.id);
        setSelectedService(subcategory.serviceName);
        setSelectedCategory(subcategory.category);
        setSubcategoryName(subcategory.subcategory);
        setDescription(subcategory.description || '');
        setPrice(subcategory.price || '');
        setDuration(subcategory.duration || '');
        setImageUrl(subcategory.imageUrl || '');
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (subcategory) => {
        if (!window.confirm(`Are you sure you want to delete the subcategory "${subcategory.subcategory}"?`)) return;
        try {
            const res = await adminApi.deleteService(subcategory.id);
            if (res.success) {
                toast.success('Subcategory deleted successfully!');
                fetchData();
            }
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedService || !selectedCategory || !subcategoryName.trim() || !price || !duration) {
            toast.error('All fields are required!');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', selectedService);
            formData.append('category', selectedCategory);
            formData.append('subcategory', subcategoryName);
            formData.append('description', description || '');
            formData.append('price', price);
            formData.append('duration', duration);

            if (imageFile) {
                formData.append('image', imageFile);
            } else if (imageUrl) {
                formData.append('imageUrl', imageUrl);
            }

            let res;
            if (editingId) {
                res = await adminApi.updateService(editingId, formData);
                if (res.success) toast.success('Subcategory updated successfully!');
            } else {
                // Check if this combination already exists
                const checkRes = await adminApi.getServices({
                    serviceName: selectedService,
                    category: selectedCategory,
                    subcategory: subcategoryName
                });
                if (checkRes.success && checkRes.data.services.length > 0) {
                    toast.error('This subcategory already exists!');
                    setSubmitting(false);
                    return;
                }
                res = await adminApi.createService(formData);
                if (res.success) toast.success('Subcategory created successfully!');
            }
            setShowForm(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save subcategory');
        } finally {
            setSubmitting(false);
        }
    };

    const getCategoriesForService = () => {
        return categories.filter(c => c.serviceName === selectedService);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-extrabold text-dark mb-1">Subcategory Management</h1>
                    <p className="text-muted">Add specific services with pricing under categories</p>
                </div>
                {!showForm && (
                    <button onClick={handleOpenCreate} className="btn btn-dark fw-bold d-flex align-items-center gap-2 px-4 shadow-sm">
                        <FaPlus />
                        <span>Add Subcategory</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                    <h5 className="fw-bold mb-4 border-bottom pb-2">
                        {editingId ? 'Edit Subcategory' : 'Create New Subcategory'}
                    </h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Select Service *</label>
                                <select
                                    required
                                    className="form-select bg-light border-0"
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                >
                                    <option value="">Choose a service...</option>
                                    {serviceNames.map(service => (
                                        <option key={service._id} value={service.name}>
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Select Category *</label>
                                <select
                                    required
                                    className="form-select bg-light border-0"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    disabled={!selectedService}
                                >
                                    <option value="">Choose a category...</option>
                                    {getCategoriesForService().map(cat => (
                                        <option key={cat.category} value={cat.category}>
                                            {cat.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Subcategory Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control bg-light border-0"
                                    placeholder="e.g., Deep Cleaning, AC Repair"
                                    value={subcategoryName}
                                    onChange={(e) => setSubcategoryName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label text-muted small fw-bold">Description</label>
                                <textarea
                                    rows="2"
                                    className="form-control bg-light border-0"
                                    placeholder="Detailed description of this subcategory"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Price (INR) *</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaRupeeSign /></span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="1"
                                        className="form-control bg-light border-0"
                                        placeholder="799"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Duration (Minutes) *</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaClock /></span>
                                    <input
                                        type="number"
                                        required
                                        min="5"
                                        step="5"
                                        className="form-control bg-light border-0"
                                        placeholder="60"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    disabled={!!imageFile}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label text-muted small fw-bold">Or Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control bg-light border-0"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    disabled={!!imageUrl}
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-secondary px-4 py-2">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting} className="btn btn-dark fw-bold px-4 py-2 shadow-sm">
                                {submitting ? 'Saving...' : 'Save Subcategory'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                {loading ? (
                    <LoadingSpinner message="Loading subcategories..." />
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light border-0">
                                <tr>
                                    <th>Service</th>
                                    <th>Category</th>
                                    <th>Subcategory</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subcategories.map((subcategory) => (
                                    <tr key={subcategory.id}>
                                        <td className="fw-bold text-dark">
                                            {subcategory.serviceName}
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-secondary border text-uppercase" style={{ fontSize: '0.7rem' }}>
                                                {subcategory.category}
                                            </span>
                                        </td>
                                        <td className="fw-semibold">
                                            <FaLayerGroup className="text-primary me-2" />
                                            {subcategory.subcategory}
                                        </td>
                                        <td className="text-muted" style={{ maxWidth: '200px' }}>
                                            {subcategory.description || 'No description'}
                                        </td>
                                        <td className="fw-bold text-primary">₹{subcategory.price}</td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {subcategory.duration} min
                                            </span>
                                        </td>
                                        <td>
                                            {subcategory.isActive !== false ? (
                                                <span className="text-success d-flex align-items-center gap-1 small fw-bold">
                                                    <FaCheckCircle />
                                                    <span>Active</span>
                                                </span>
                                            ) : (
                                                <span className="text-danger d-flex align-items-center gap-1 small fw-bold">
                                                    <FaTimesCircle />
                                                    <span>Inactive</span>
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button
                                                    onClick={() => handleOpenEdit(subcategory)}
                                                    className="btn btn-sm btn-light border text-primary"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(subcategory)}
                                                    className="btn btn-sm btn-light border text-danger"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {subcategories.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted">
                                            No subcategories found. Create your first subcategory!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubcategoryManagement;