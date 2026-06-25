import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import serviceService from '../services/serviceService';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaShieldAlt, FaBolt, FaWrench, FaUserShield, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const servicesRes = await serviceService.getAllServices();
                if (servicesRes.success) {
                    // Show top 3 services on home page
                    setServices(servicesRes.data.services.slice(0, 3));
                }
                const categoriesRes = await serviceService.getCategories();
                if (categoriesRes.success) {
                    setCategories(categoriesRes.data.categories);
                }
            } catch (err) {
                console.error('Error fetching home page data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    return (
        <div>
            {/* 1. Hero Section */}
            <div className="bg-dark text-light py-5 mb-5 position-relative overflow-hidden" style={{ minHeight: '450px', background: 'linear-gradient(135deg, #1e1e2f 0%, #111119 100%)' }}>
                <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'scale(1.5)', pointerEvents: 'none' }}>
                    <FaBolt size={300} className="text-warning" />
                </div>
                <div className="container py-5 position-relative z-1">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-3 tracking-wider">Certified Safe & Secure</span>
                            <h1 className="display-4 fw-extrabold mb-3 text-white">1App Professional Electrical Services</h1>
                            <p className="lead text-muted-light fs-5 mb-4">
                                Book highly qualified, certified technicians for all your cabling, wiring, installation, and appliance maintenance needs. We use premium 1App fire-resistant wires for guaranteed safety.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link to="/services" className="btn btn-warning btn-lg px-4 fw-bold shadow">
                                    Book a Service Now
                                </Link>
                                <a href="#why-us" className="btn btn-outline-light btn-lg px-4">
                                    Why Choose Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* 2. Categories Browser */}
                <div className="mb-5 py-3">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-dark">Explore Our Service Categories</h2>
                        <p className="text-muted">Select a category to view specialized solutions for your home or office</p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="col-md-3 col-sm-6">
                                <Link to={`/services?category=${encodeURIComponent(cat)}`} className="text-decoration-none">
                                    <div className="card border-0 shadow-sm text-center py-4 px-3 hover-lift transition-all rounded-3 h-100 bg-white">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning p-3 rounded-circle mb-3 mx-auto" style={{ width: '60px', height: '60px' }}>
                                            <FaBolt size={24} />
                                        </div>
                                        <h5 className="fw-bold text-dark mb-0">{cat}</h5>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <>
                                {['Wiring & Cabling', 'Installation', 'Safety & Testing', 'Repair & Troubleshooting'].map((cat, idx) => (
                                    <div key={idx} className="col-md-3 col-sm-6">
                                        <Link to={`/services?category=${encodeURIComponent(cat)}`} className="text-decoration-none">
                                            <div className="card border-0 shadow-sm text-center py-4 px-3 hover-lift transition-all rounded-3 h-100 bg-white">
                                                <div className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning p-3 rounded-circle mb-3 mx-auto" style={{ width: '60px', height: '60px' }}>
                                                    <FaWrench size={24} />
                                                </div>
                                                <h5 className="fw-bold text-dark mb-0">{cat}</h5>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* 3. Featured Services */}
                <div className="mb-5 py-3">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <h2 className="fw-bold text-dark mb-1">Our Featured Services</h2>
                            <p className="text-muted mb-0">Book premium electrical installations and inspections directly</p>
                        </div>
                        <Link to="/services" className="btn btn-outline-primary d-flex align-items-center gap-2 fw-semibold">
                            <span>View All Services</span>
                            <FaArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <LoadingSpinner message="Fetching services..." />
                    ) : (
                        <div className="row g-4">
                            {services.map((service) => (
                                <div key={service._id} className="col-lg-4 col-md-6">
                                    <ServiceCard service={service} />
                                </div>
                            ))}
                            {services.length === 0 && (
                                <div className="text-center py-5">
                                    <p className="text-muted">No services found. Run the database seed script to populate data.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 4. Why 1App Section */}
                <div id="why-us" className="bg-white rounded-4 shadow-sm p-5 mb-5 mt-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-5">
                            <span className="text-warning fw-bold text-uppercase tracking-wider">Safety First</span>
                            <h2 className="fw-extrabold text-dark mt-2 mb-3">Why Trust 1App Professionals?</h2>
                            <p className="text-muted mb-4">
                                Electrical installations are the backbone of your building. A small error can cause fire hazards or system collapses. 1App offers professional service booking directly aligned with industry safety standards.
                            </p>
                            <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                                <li className="d-flex gap-3 align-items-start">
                                    <div className="bg-success text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>✓</div>
                                    <div><strong>Fire-Resistant Cables:</strong> We exclusively install premium flame retardant (FR) cables.</div>
                                </li>
                                <li className="d-flex gap-3 align-items-start">
                                    <div className="bg-success text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>✓</div>
                                    <div><strong>Certified Technicians:</strong> All technicians are background-checked and certified.</div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-7">
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <div className="p-4 border rounded-3 bg-light h-100">
                                        <FaShieldAlt size={32} className="text-primary mb-3" />
                                        <h5 className="fw-bold">100% Secure Wiring</h5>
                                        <p className="text-muted small mb-0">Ensuring zero leakage and fireproof configurations.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="p-4 border rounded-3 bg-light h-100">
                                        <FaBolt size={32} className="text-warning mb-3" />
                                        <h5 className="fw-bold">Fast Response Times</h5>
                                        <p className="text-muted small mb-0">Quick turnaround slots for emergency troubleshooting.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="p-4 border rounded-3 bg-light h-100">
                                        <FaWrench size={32} className="text-danger mb-3" />
                                        <h5 className="fw-bold">Professional Tools</h5>
                                        <p className="text-muted small mb-0">Equipped with state-of-the-art testing & calibration meters.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="p-4 border rounded-3 bg-light h-100">
                                        <FaUserShield size={32} className="text-success mb-3" />
                                        <h5 className="fw-bold">Service Warranty</h5>
                                        <p className="text-muted small mb-0">Enjoy 30 days of standard post-service warranty cover.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;