import React, { useEffect, useState } from 'react';
import adminApi from '../services/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaRupeeSign, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Form/Modal states
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getServices();
            if (res.success) {
                setServices(res.data.services);
            }
            const catRes = await adminApi.getCategories();
            if (catRes.success) {
                setCategories(catRes.data.categories);
            }
        } catch (err) {
            toast.error('Failed to load services database');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenCreate = () => {
        setEditingId(null);
        setName('');
        setDescription('');
        setPrice('');
        setDuration('');
        setCategory('');
        setSubcategory('');
        setImageUrl('');
        setImageFile(null);
        setShowForm(true);
    };

    const handleOpenEdit = (service) => {
        setEditingId(service._id);
        setName(service.name);
        setDescription(service.description);
        setPrice(service.price);
        setDuration(service.duration);
        setCategory(service.category);
        setSubcategory(service.subcategory || '');
        setImageUrl(service.imageUrl || '');
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to deactivate/delete this service?')) return;
        try {
            const res = await adminApi.deleteService(id);
            if (res.success) {
                toast.success('Service de-activated successfully!');
                fetchServices();
            }
        } catch (err) {
            toast.error('Deactivation failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim() || !price || !duration || !category.trim() || !subcategory.trim()) {
            toast.error('All fields are required!');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('duration', duration);
            formData.append('category', category);
            formData.append('subcategory', subcategory);

            if (imageFile) {
                formData.append('image', imageFile);
            } else if (imageUrl) {
                formData.append('imageUrl', imageUrl);
            }

            let res;
            if (editingId) {
                res = await adminApi.updateService(editingId, formData);
                if (res.success) toast.success('Service updated successfully!');
            } else {
                res = await adminApi.createService(formData);
                if (res.success) toast.success('Service created successfully!');
            }
            setShowForm(false);
            fetchServices();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save service');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-extrabold text-dark mb-1">Service Database</h1>
                    <p className="text-muted">Register, edit, or remove 1App customer booking service items.</p>
                </div>
                {!showForm && (
                    <button onClick={handleOpenCreate} className="btn btn-dark fw-bold d-flex align-items-center gap-2 px-4 shadow-sm">
                        <FaPlus />
                        <span>Add New Service</span>
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                    <h5 className="fw-bold mb-4 border-bottom pb-2">
                        {editingId ? 'Edit Existing Service Details' : 'Register New Electrical Service'}
                    </h5>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Service Name</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control bg-light border-0"
                                    placeholder="Ceiling Fan Repair"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Category</label>
                                <input
                                    type="text"
                                    required
                                    list="existing-categories"
                                    className="form-control bg-light border-0"
                                    placeholder="Installation, Cabling, Safety, etc."
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                <datalist id="existing-categories">
                                    {categories.map((cat, idx) => <option key={idx} value={cat.category} />)}
                                </datalist>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Subcategory</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control bg-light border-0"
                                    placeholder="Electrical Safety, Plumbing, etc."
                                    value={subcategory}
                                    onChange={(e) => setSubcategory(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Price (INR)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaRupeeSign /></span>
                                    <input
                                        type="number"
                                        required
                                        className="form-control bg-light border-0"
                                        placeholder="799"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Duration (Minutes)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaClock /></span>
                                    <input
                                        type="number"
                                        required
                                        className="form-control bg-light border-0"
                                        placeholder="60"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold">Detailed Description</label>
                                <textarea
                                    rows="3"
                                    required
                                    className="form-control bg-light border-0"
                                    placeholder="Explain step-by-step what the service includes..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Image selector */}
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
                                <label className="form-label text-muted small fw-bold">Or Upload Image File</label>
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
                                {submitting ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            {/* List Table */}
            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                {loading ? (
                    <LoadingSpinner message="Searching services..." />
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light border-0">
                                <tr>
                                    <th>Image</th>
                                    <th>Service Name</th>
                                    <th>Category</th>
                                    <th>Subcategory</th>
                                    <th>Cost / Duration</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service) => (
                                    <tr key={service._id}>
                                        <td>
                                            <img
                                                src={service.imageUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=150'}
                                                alt={service.name}
                                                className="rounded object-fit-cover"
                                                style={{ width: '48px', height: '48px' }}
                                            />
                                        </td>
                                        <td className="fw-bold text-dark">{service.name}</td>
                                        <td><span className="badge bg-light text-secondary border text-uppercase" style={{ fontSize: '0.7rem' }}>{service.category}</span></td>
                                        <td><span className="badge bg-light text-secondary border text-uppercase" style={{ fontSize: '0.7rem' }}>{service.subcategory}</span></td>
                                        <td>
                                            <div className="fw-bold text-primary">₹{service.price}</div>
                                            <small className="text-muted">{service.duration} mins</small>
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
                                                        title="Delete (deactivate)"
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
                                        <td colSpan="6" className="text-center py-5 text-muted">No services found in database. Seeding recommended.</td>
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
