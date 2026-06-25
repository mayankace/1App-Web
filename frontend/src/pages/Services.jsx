import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import serviceService from '../services/serviceService';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';

const Services = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const activeCategory = searchParams.get('category') || '';

    useEffect(() => {
        // Fetch categories once on load
        const fetchCategories = async () => {
            try {
                const res = await serviceService.getCategories();
                if (res.success) {
                    setCategories(res.data.categories);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const fetchFilteredServices = async () => {
        setLoading(true);
        try {
            const res = await serviceService.getAllServices({
                category: activeCategory,
                search: searchQuery
            });
            if (res.success) {
                setServices(res.data.services);
            }
        } catch (err) {
            console.error('Failed to load services', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredServices();
    }, [activeCategory]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchFilteredServices();
    };

    const handleCategoryClick = (category) => {
        if (category === '') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        searchParams.delete('category');
        setSearchParams(searchParams);
        // Force refresh directly
        setTimeout(() => {
            fetchFilteredServices();
        }, 50);
    };

    return (
        <div className="container">
            <div className="mb-5 text-center">
                <h1 className="fw-extrabold text-dark">Our Professional Electrical Services</h1>
                <p className="text-muted lead">Choose the right wiring, installation, and inspection service matching your needs.</p>
            </div>

            <div className="row g-4 mb-5">
                {/* 1. Search Bar */}
                <div className="col-12">
                    <form onSubmit={handleSearchSubmit} className="bg-white p-3 rounded-3 shadow-sm d-flex gap-2">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><FaSearch className="text-muted" /></span>
                            <input 
                                type="text"
                                className="form-control bg-light border-0 py-2 fs-6"
                                placeholder="Search electrical service details, wire installations, safety checks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-warning px-4 fw-bold">Search</button>
                        {(activeCategory || searchQuery) && (
                            <button 
                                type="button" 
                                onClick={handleClearFilters}
                                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                            >
                                <FaTimesCircle />
                                <span>Reset</span>
                            </button>
                        )}
                    </form>
                </div>

                {/* 2. Left Column: Categories Navigation */}
                <div className="col-lg-3">
                    <div className="card border-0 shadow-sm rounded-3 p-4 bg-white sticky-lg-top" style={{ top: '100px', zIndex: 10 }}>
                        <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Categories</h5>
                        <div className="d-flex flex-column gap-2">
                            <button 
                                onClick={() => handleCategoryClick('')}
                                className={`btn text-start py-2 px-3 fw-medium rounded-3 ${!activeCategory ? 'btn-warning text-dark fw-bold' : 'btn-light text-muted'}`}
                            >
                                All Services
                            </button>
                            {categories.map((cat, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`btn text-start py-2 px-3 fw-medium rounded-3 ${activeCategory === cat ? 'btn-warning text-dark fw-bold' : 'btn-light text-muted'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Right Column: Services Grid */}
                <div className="col-lg-9">
                    {loading ? (
                        <LoadingSpinner message="Searching services..." />
                    ) : (
                        <div>
                            {services.length > 0 ? (
                                <div className="row g-4">
                                    {services.map((service) => (
                                        <div key={service._id} className="col-md-6 col-lg-6">
                                            <ServiceCard service={service} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5 bg-white rounded-3 shadow-sm border p-4">
                                    <FaTimesCircle className="text-muted mb-3" size={48} />
                                    <h4 className="fw-bold text-dark">No Services Found</h4>
                                    <p className="text-muted">We couldn't find any services matching your filters. Try search keywords or different category filters.</p>
                                    <button onClick={handleClearFilters} className="btn btn-warning fw-bold px-4 mt-2">
                                        View All Services
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;
