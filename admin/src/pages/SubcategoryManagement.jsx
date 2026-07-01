import React, { useEffect, useState } from 'react';
import adminApi from '../services/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    FaPlus, FaEdit, FaTrash, FaLayerGroup, FaRupeeSign,
    FaClock, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const SubcategoryManagement = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [svcRes, catRes, subRes] = await Promise.all([
                adminApi.getServices(),
                adminApi.getCategories(),
                adminApi.getSubCategories()
            ]);
            if (svcRes.success) setServices(svcRes.data.services);
            if (catRes.success) setCategories(catRes.data.categories);
            if (subRes.success) setSubcategories(subRes.data.subcategories);
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Filter subcategories when category changes
    useEffect(() => {
        if (selectedCategoryId) {
            setFilteredSubcategories(subcategories.filter(s => s.category?._id === selectedCategoryId));
            setSelectedSubcategoryId('');
        } else {
            setFilteredSubcategories([]);
        }
    }, [selectedCategoryId, subcategories]);

    const resetForm = () => {
        setEditingId(null);
        setSelectedCategoryId('');
        setSelectedSubcategoryId('');
        setServiceName('');
        setDescription('');
        setPrice('');
        setDuration('');
        setImageUrl('');
        setImageFile(null);
    };

    const handleOpenCreate = () => { resetForm(); setShowForm(true); };

    const handleOpenEdit = (svc) => {
        setEditingId(svc._id);
        const catId = svc.category?._id || '';
        setSelectedCategoryId(catId);
        // Pre-filter subcategories for this category
        setFilteredSubcategories(subcategories.filter(s => s.category?._id === catId));
        setSelectedSubcategoryId(svc.subcategory?._id || '');
        setServiceName(svc.name || '');
        setDescription(svc.description || '');
        setPrice(svc.price || '');
        setDuration(svc.duration || '');
        setImageUrl(svc.imageUrl || '');
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        try {
            const res = await adminApi.deleteService(id);
            if (res.success) { toast.success('Service deleted!'); fetchData(); }
        } catch { toast.error('Deletion failed'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategoryId || !selectedSubcategoryId || !serviceName.trim() || !price || !duration) {
            toast.error('All fields are required!');
            return;
        }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', serviceName);
            formData.append('category', selectedCategoryId);
            formData.append('subcategory', selectedSubcategoryId);
            formData.append('description', description || '');
            formData.append('price', price);
            formData.append('duration', duration);
            if (imageFile) formData.append('image', imageFile);
            else if (imageUrl) formData.append('imageUrl', imageUrl);

            let res;
            if (editingId) {
                res = await adminApi.updateService(editingId, formData);
                if (res.success) toast.success('Service updated!');
            } else {
                res = await adminApi.createService(formData);
                if (res.success) toast.success('Service created!');
            }
            setShowForm(false);
            fetchData();
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
                    <h1 className="fw-extrabold text-dark mb-1">Service Management</h1>
                    <p className="text-muted">Add specific services with pricing under sub-categories</p>
                </div>
                {!showForm && (
                    <button onClick={handleOpenCreate} className="btn btn-dark fw-bold d-flex align-items-center gap-2 px-4 shadow-sm">
                        <FaPlus /><span>Add Service</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                    <h5 className="fw-bold mb-4 border-bottom pb-2">
                        {editingId ? 'Edit Service' : 'Create New Service'}
                    </h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Select Category *</label>
                                <select
                                    required
                                    className="form-select bg-light border-0"
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                >
                                    <option value="">Choose a category...</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Select Sub-Category *</label>
                                <select
                                    required
                                    className="form-select bg-light border-0"
                                    value={selectedSubcategoryId}
                                    onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                                    disabled={!selectedCategoryId}
                                >
                                    <option value="">Choose a sub-category...</option>
                                    {filteredSubcategories.map(sub => (
                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Service Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control bg-light border-0"
                                    placeholder="e.g., Deep Cleaning, AC Repair"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label text-muted small fw-bold">Description</label>
                                <textarea
                                    rows="2"
                                    className="form-control bg-light border-0"
                                    placeholder="Detailed description of this service"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Price (INR) *</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaRupeeSign /></span>
                                    <input
                                        type="number" required min="0" step="1"
                                        className="form-control bg-light border-0"
                                        placeholder="799" value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-bold">Duration (Minutes) *</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><FaClock /></span>
                                    <input
                                        type="number" required min="5" step="5"
                                        className="form-control bg-light border-0"
                                        placeholder="60" value={duration}
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
                                    type="file" accept="image/*"
                                    className="form-control bg-light border-0"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    disabled={!!imageUrl}
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-secondary px-4 py-2">Cancel</button>
                            <button type="submit" disabled={submitting} className="btn btn-dark fw-bold px-4 py-2 shadow-sm">
                                {submitting ? 'Saving...' : 'Save Service'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                {loading ? <LoadingSpinner message="Loading services..." /> : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light border-0">
                                <tr>
                                    <th>Category</th>
                                    <th>Sub-Category</th>
                                    <th>Service Name</th>
                                    <th>Price</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((svc) => (
                                    <tr key={svc._id}>
                                        <td className="fw-bold text-dark">{svc.category?.name || '—'}</td>
                                        <td>
                                            <span className="badge bg-light text-secondary border text-uppercase" style={{ fontSize: '0.7rem' }}>
                                                {svc.subcategory?.name || '—'}
                                            </span>
                                        </td>
                                        <td className="fw-semibold">
                                            <FaLayerGroup className="text-primary me-2" />{svc.name}
                                        </td>
                                        <td className="fw-bold text-primary">₹{svc.price}</td>
                                        <td><span className="badge bg-light text-dark border">{svc.duration} min</span></td>
                                        <td>
                                            {svc.isActive ? (
                                                <span className="text-success d-flex align-items-center gap-1 small fw-bold"><FaCheckCircle /><span>Active</span></span>
                                            ) : (
                                                <span className="text-danger d-flex align-items-center gap-1 small fw-bold"><FaTimesCircle /><span>Inactive</span></span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button onClick={() => handleOpenEdit(svc)} className="btn btn-sm btn-light border text-primary" title="Edit"><FaEdit /></button>
                                                <button onClick={() => handleDelete(svc._id)} className="btn btn-sm btn-light border text-danger" title="Delete"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {services.length === 0 && (
                                    <tr><td colSpan="7" className="text-center py-5 text-muted">No services found. Create your first service!</td></tr>
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
