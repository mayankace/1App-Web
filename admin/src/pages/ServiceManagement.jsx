import React, { useEffect, useState } from 'react';
import adminApi from '../services/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaWrench } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getServices();
            if (res.success) {
                // Get unique service names
                const uniqueServices = res.data.services.reduce((acc, service) => {
                    if (!acc.find(s => s.name === service.name)) {
                        acc.push({
                            _id: service._id,
                            name: service.name,
                            description: service.description || '',
                            imageUrl: service.imageUrl || '',
                            isActive: service.isActive,
                            createdAt: service.createdAt
                        });
                    }
                    return acc;
                }, []);
                // setServices stores top-level categories (the `name` field)
                setServices(uniqueServices);
            }
        } catch (err) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenCreate = () => {
        setEditingId(null);
        setCategoryName('');
        setDescription('');
        setImageUrl('');
        setImageFile(null);
        setShowForm(true);
    };

    const handleOpenEdit = (service) => {
        setEditingId(service._id);
        setCategoryName(service.name);
        setDescription(service.description || '');
        setImageUrl(service.imageUrl || '');
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? This will also delete all associated sub-categories and services.')) return;
        try {
            const res = await adminApi.deleteService(id);
            if (res.success) {
                toast.success('Service deleted successfully!');
                fetchServices();
            }
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            toast.error('Category name is required!');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', categoryName);
            formData.append('description', description || '');
            formData.append('price', 0);
            formData.append('duration', 30);
            formData.append('category', 'General');
            formData.append('subcategory', 'General');

            if (imageFile) {
                formData.append('image', imageFile);
            } else if (imageUrl) {
                formData.append('imageUrl', imageUrl);
            }

            let res;
            if (editingId) {
                res = await adminApi.updateService(editingId, formData);
                if (res.success) toast.success('Category updated successfully!');
            } else {
                res = await adminApi.createService(formData);
                if (res.success) toast.success('Category created successfully!');
            }
            setShowForm(false);
            fetchServices();
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
                    <p className="text-muted">Manage top-level categories (e.g., Home Care, Electrical, Plumbing)</p>
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
                            <div className="col-md-8">
                                <label className="form-label text-muted small fw-bold">Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control bg-light border-0"
                                    placeholder="e.g., Home Care, Electrical Services"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label text-muted small fw-bold">Description</label>
                                <textarea
                                    rows="2"
                                    className="form-control bg-light border-0"
                                    placeholder="Brief description of this service"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
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
                            <div className="col-md-6">
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
                                {submitting ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                {loading ? (
                    <LoadingSpinner message="Loading services..." />
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light border-0">
                                <tr>
                                    <th>Image</th>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service) => (
                                    <tr key={service._id}>
                                        <td>
                                            {service.imageUrl ? (
                                                <img
                                                    src={service.imageUrl}
                                                    alt={service.name}
                                                    className="rounded object-fit-cover"
                                                    style={{ width: '48px', height: '48px' }}
                                                />
                                            ) : (
                                                <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                                    <FaWrench className="text-muted" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="fw-bold text-dark">{service.name}</td>
                                        <td className="text-muted" style={{ maxWidth: '300px' }}>
                                            {service.description || 'No description'}
                                        </td>
                                        <td>
                                            {service.isActive ? (
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
                                                    onClick={() => handleOpenEdit(service)}
                                                    className="btn btn-sm btn-light border text-primary"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                {service.isActive && (
                                                    <button
                                                        onClick={() => handleDelete(service._id)}
                                                        className="btn btn-sm btn-light border text-danger"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {services.length === 0 && (
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

export default ServiceManagement;