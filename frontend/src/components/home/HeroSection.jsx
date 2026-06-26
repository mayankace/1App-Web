import React from 'react';
import { Link } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';

const HeroSection = ({ services }) => {
    return (
        <div className="container mt-5 pt-3 mb-5">
            <div className="row g-5 align-items-center">
                {/* Left Side: Services Grid */}
                <div className="col-lg-6">
                    <h1 className="display-5 fw-extrabold text-dark mb-5 lh-sm">
                        Home services,<br/>on demand.
                    </h1>
                    
                    <div className="row g-3">
                        {services.slice(0, 9).map((service, idx) => (
                            <div key={service._id || idx} className="col-4 text-center">
                                <Link to={`/services?serviceName=${encodeURIComponent(service.name)}&category=${encodeURIComponent(service.category)}&subcategory=${encodeURIComponent(service.subcategory || '')}`} className="text-decoration-none">
                                    <div className="d-inline-flex align-items-center justify-content-center bg-light text-dark rounded-4 mb-2 overflow-hidden hover-shadow transition-all" style={{ width: '70px', height: '70px' }}>
                                        {service.imageUrl ? (
                                            <img src={`http://localhost:5000${service.imageUrl}`} alt={service.name} className="w-100 h-100 object-fit-cover" />
                                        ) : (
                                            <FaBolt size={24} />
                                        )}
                                    </div>
                                    <div className="text-dark fw-medium small lh-sm" style={{ fontSize: '0.75rem' }}>
                                        {service.subcategory || service.name}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Collage */}
                <div className="col-lg-6 d-none d-lg-block">
                    <div className="row g-3 h-100">
                        <div className="col-6">
                            <div className="h-100 rounded-4 overflow-hidden position-relative" style={{ minHeight: '400px' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=600&fit=crop"
                                    alt="Service professional"
                                    className="w-100 h-100 object-fit-cover"
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"></div>
                            </div>
                        </div>
                        <div className="col-6 d-flex flex-column gap-3">
                            <div className="rounded-4 overflow-hidden position-relative" style={{ flex: 1, minHeight: '192px' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop"
                                    alt="Service professional"
                                    className="w-100 h-100 object-fit-cover"
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"></div>
                            </div>
                            <div className="rounded-4 overflow-hidden position-relative" style={{ flex: 1, minHeight: '192px' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop"
                                    alt="Service professional"
                                    className="w-100 h-100 object-fit-cover"
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
