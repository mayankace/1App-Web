import React, { useEffect, useState } from 'react';
import adminApi from '../services/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaFolderOpen, FaTools } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await adminApi.getServices();
                if (res.success) {
                    setServices(res.data.services);
                    
                    // Count services and subcategories per category
                    const counts = {};
                    res.data.services.forEach(s => {
                        if (!counts[s.category]) {
                            counts[s.category] = { count: 0, subcategories: new Set() };
                        }
                        counts[s.category].count++;
                        if (s.subcategory) {
                            counts[s.category].subcategories.add(s.subcategory);
                        }
                    });

                    // Build list of unique categories
                    const uniqueCats = Object.keys(counts).map(name => ({
                        name,
                        count: counts[name].count,
                        subcategories: Array.from(counts[name].subcategories)
                    }));
                    setCategories(uniqueCats);
                }
            } catch (err) {
                toast.error('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Summarizing categories..." />;
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="fw-extrabold text-dark mb-1">Service Categories</h1>
                <p className="text-muted">Analyze product lines and counts of registered services.</p>
            </div>

            <div className="row g-4">
                {categories.map((cat, idx) => (
                    <div key={idx} className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-3 p-4 bg-white hover-shadow transition-all">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div className="bg-dark-subtle text-dark rounded-circle p-3 d-inline-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                    <FaFolderOpen size={24} />
                                </div>
                                <span className="badge bg-light text-primary border font-monospace px-3 py-2 fs-7 fw-bold">
                                    {cat.count} {cat.count === 1 ? 'Service' : 'Services'}
                                </span>
                            </div>
                            <h4 className="fw-bold text-dark mb-1">{cat.name}</h4>
                            <div className="mt-3">
                                {cat.subcategories.map(sub => (
                                    <span key={sub} className="badge bg-light text-secondary border me-1 mb-1">{sub}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && (
                    <div className="col-12 text-center py-5 bg-white rounded-3 shadow-sm border p-4">
                        <FaTools size={48} className="text-muted mb-3" />
                        <h5 className="fw-bold">No Categories Found</h5>
                        <p className="text-muted">Seed the service database to list categories.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;
