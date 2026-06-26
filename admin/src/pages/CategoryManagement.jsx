import React, { useEffect, useState } from 'react';
import adminApi from '../services/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaFolder, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [serviceNames, setServiceNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedService, setSelectedService] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Get all services
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
                servicesRes.data.services.forEach(service => {
                    if (service.category && service.category !== 'General') {
                        const key = `${service.name}|${service.category}`;
                        if (!categoryMap[key]) {
                            categoryMap[key] = {
                                id: service._id,
                                serviceName: service.name,
                                category: service.category,
                                description: service.categoryDescription || '',
                                isActive: service.isActive
                            };
                        }
                    }
                });
                setCategories(Object.values(categoryMap));
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

    const handleOpenCreate = () => {
        setEditingId(null);
        setSelectedService('');
        setCategoryName('');
        setDescription('');
        setShowForm(true);
    };

    const handleOpenEdit = (category) => {
        setEditingId(category.id);
        setSelectedService(category.serviceName);
        setCategoryName(category.category);
        setDescription(category.description || '');
        setShowForm(true);
    };

    const handleDelete = async (category) => {
        if (!window.confirm(`Are you sure you want to delete the category "${category.category}"? This will also delete all associated subcategories.`)) return;
        try {
            // Find all services with this category and delete them
            const servicesRes = await adminApi.getServices({
                serviceName: category.serviceName,
                category: category.category
            });

            if (servicesRes.success) {
                for (const service of servicesRes.data.services) {
                    await adminApi.deleteService(service._id);
                }
                toast.success('Category deleted successfully!');
                fetchData();
            }
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedService || !categoryName.trim()) {
            toast.error('Service name and category are required!');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', selectedService);
            formData.append('category', categoryName);
            formData.append('subcategory', 'General');
            formData.append('description', description || '');
            formData.append('price', 0);
            formData.append('duration', 30);

            let res;
            if (editingId) {
                // Find existing service and update
                const servicesRes = await adminApi.getServices({
                    serviceName: selectedService,
                    category: categoryName
                });
                if (servicesRes.success && servicesRes.data.services.length > 0) {
                    const serviceId = servicesRes.data.services[0]._id;
                    formData.append('name', selectedService);
                    formData.append('category', categoryName);
                    res = await adminApi.updateService(serviceId, formData);
                }
            } else {
                res = await adminApi.createService(formData);
            }

            if (res?.success) {
                toast.success(editingId ? 'Category updated successfully!' : 'Category created successfully!');
                setShowForm(false);
                fetchData();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-extrabold text-dark mb-1">Category Management</h1>
                    <p className="text-muted">Add categories under specific services (e.g., Cleaning under Home Care)</p>
                </div>
                {!showForm && (
                    <button onClick={handleOpenCreate} className="btn btn-dark fw-bold d-flex align-items-center gap-2 px-4 shadow-sm">
                        <FaPlus />
                        <span>Add Category</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                    <h5 className="fw-bold mb-4 border-bottom pb-2">
                        {editingId ? 'Edit Category' : 'Create New Category'}
                    </h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
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
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control bg-light border-0"
                                    placeholder="e.g., Cleaning, Wiring, Repair"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label text-muted small fw-bold">Description</label>
                                <textarea
                                    rows="2"
                                    className="form-control bg-light border-0"
                                    placeholder="Brief description of this category"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-secondary px-4 py-2">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting} className="btn btn-dark fw-bold px-4 py-2 shadow-sm">
                                {submitting ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                {loading ? (
                    <LoadingSpinner message="Loading categories..." />
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light border-0">
                                <tr>
                                    <th>Service</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="fw-bold text-dark">
                                            <FaFolder className="text-primary me-2" />
                                            {category.serviceName}
                                        </td>
                                        <td className="fw-semibold">{category.category}</td>
                                        <td className="text-muted" style={{ maxWidth: '300px' }}>
                                            {category.description || 'No description'}
                                        </td>
                                        <td>
                                            {category.isActive !== false ? (
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
                                                    onClick={() => handleOpenEdit(category)}
                                                    className="btn btn-sm btn-light border text-primary"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className="btn btn-sm btn-light border text-danger"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No categories found. Create your first category!
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

export default CategoryManagement;