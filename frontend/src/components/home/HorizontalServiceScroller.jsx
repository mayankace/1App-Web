import React from 'react';
import { Link } from 'react-router-dom';

const HorizontalServiceScroller = ({ title, subtitle, services }) => {
    if (!services || services.length === 0) return null;

    return (
        <div className="container mb-5">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">{title}</h2>
                    {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
                </div>
            </div>

            <div className="d-flex gap-4 hide-scrollbar py-2" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {services.map((service) => (
                    <div key={service._id} className="card border-0 shadow-sm rounded-4 text-start hover-shadow transition-all bg-white flex-shrink-0" style={{ width: '220px', cursor: 'pointer' }}>
                        <Link to={`/services?category=${encodeURIComponent(service.category)}&subcategory=${encodeURIComponent(service.subcategory || '')}`} className="text-decoration-none text-dark">
                            <div className="rounded-top-4 overflow-hidden" style={{ height: '140px', backgroundColor: '#f8f9fa' }}>
                                {service.imageUrl ? (
                                    <img src={`http://localhost:5000${service.imageUrl}`} alt={service.name} className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">No Image</div>
                                )}
                            </div>
                            <div className="p-3">
                                <h6 className="fw-bold mb-1 text-truncate">{service.name}</h6>
                                <p className="text-muted small mb-0">₹{service.price} • {service.duration} mins</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HorizontalServiceScroller;
