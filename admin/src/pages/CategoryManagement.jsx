import React, { useEffect, useState } from 'react';
import adminApi from '../services/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaFolder, FaImage, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [subcategoryName, setSubcategoryName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, subRes] = await Promise.all([
                adminApi.getCategories(),
                adminApi.getSubCategories()
            ]);
            if (catRes.success) setCategories(catRes.data.categories);
            if (subRes.success) setSubcategories(subRes.data.subcategories);
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenCreate = () => {
        setEditingId(null);
        setSelectedCategoryId('');
        setSubcategoryName('');
        setImageFile(null);
        setImagePreview(null);
        setShowForm(true);
    };

    const handleOpenEdit = (sub) => {
        setEditingId(sub._id);
        setSelectedCategoryId(sub.category?._id || '');
        setSubcategoryName(sub.name);
        setImageFile(null);
        setImagePreview(sub.image ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${sub.image}` : null);
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this subcategory?')) return;
        try {
            const res = await adminApi.deleteSubCategory(id);
            if (res.success) { toast.success('SubCategory deleted!'); fetchData(); }
        } catch { toast.error('Deletion failed'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategoryId || !subcategoryName.trim()) {
            toast.error('Category and subcategory name are required!');
            return;
        }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', subcategoryName);
            formData.append('categoryId', selectedCategoryId);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            let res;
            if (editingId) {
                res = await adminApi.updateSubCategory(editingId, formData);
                if (res.success) toast.success('SubCategory updated!');
            } else {
                res = await adminApi.createSubCategory(formData);
                if (res.success) toast.success('SubCategory created!');
            }
            setShowForm(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save subcategory');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-extrabold text-dark mb-1">Sub-Category Management</h1>
                    <p className="text-muted">Add subcategories of selected categories</p>
                </div>
                {!showForm && (
                    <button onClick={handleOpenCreate} className="btn btn-dark fw-bold d-flex align-items-center gap-2 px-4 shadow-sm">
                        <FaPlus /><span>Add Sub-Category</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                    <h5 className="fw-bold mb-4 border-bottom pb-2">
                        {editingId ? 'Edit Sub-Category' : 'Create New Sub-Category'}
                    </h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
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
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Sub-Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="form-control bg-light border-0"
                                    placeholder="e.g., Cleaning, Wiring, Repair"
                                    value={subcategoryName}
                                    onChange={(e) => setSubcategoryName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label text-muted small fw-bold">Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control bg-light border-0"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        {imagePreview && (
                            <div className="mb-4">
                                <label className="text-muted small fw-bold d-block mb-2">Image Preview:</label>
                                <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '150px' }} />
                            </div>
                        )}

                        <div className="d-flex gap-2 justify-content-end">
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-secondary px-4 py-2">Cancel</button>
                            <button type="submit" disabled={submitting} className="btn btn-dark fw-bold px-4 py-2 shadow-sm">
                                {submitting ? 'Saving...' : 'Save Sub-Category'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                {loading ? <LoadingSpinner message="Loading sub-categories..." /> : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light border-0">
                                <tr>
                                    <th>Image</th>
                                    <th>Category</th>
                                    <th>Sub-Category</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subcategories.map((sub) => (
                                    <tr key={sub._id}>
                                        <td>
                                            {sub.image ? (
                                                <img 
                                                    src={`${process.env.REACT_IMAGE_URL || 'http://localhost:5000'}/uploads/${sub.image}`} 
                                                    alt={sub.name} 
                                                    className="img-thumbnail" 
                                                    style={{ maxWidth: '50px' }}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                                />
                                            ) : (
                                                <div className="bg-light text-muted d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                    <FaImage size={16} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="fw-bold text-dark">
                                            <FaFolder className="text-primary me-2" />{sub.category?.name || '—'}
                                        </td>
                                        <td className="fw-semibold">{sub.name}</td>
                                        <td>
                                            {sub.isActive ? (
                                                <span className="text-success d-flex align-items-center gap-1 small fw-bold"><FaCheckCircle /><span>Active</span></span>
                                            ) : (
                                                <span className="text-danger d-flex align-items-center gap-1 small fw-bold"><FaTimesCircle /><span>Inactive</span></span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button onClick={() => handleOpenEdit(sub)} className="btn btn-sm btn-light border text-primary" title="Edit"><FaEdit /></button>
                                                <button onClick={() => handleDelete(sub._id)} className="btn btn-sm btn-light border text-danger" title="Delete"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {subcategories.length === 0 && (
                                    <tr><td colSpan="5" className="text-center py-5 text-muted">No sub-categories found. Create your first sub-category!</td></tr>
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
