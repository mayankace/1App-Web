import React from 'react';
import { Link } from 'react-router-dom';

const CategorySEOFooter = ({ categories }) => {
    return (
        <div className="container mb-5 pb-5">
            <hr className="my-5" />
            <div className="row g-4">
                {categories.slice(0, 4).map((serviceGroup, idx) => (
                    <div key={idx} className="col-md-3 col-6">
                        <h6 className="fw-bold text-dark mb-3">{serviceGroup.serviceName || serviceGroup.category}</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            {(serviceGroup.categories || []).slice(0, 5).map((cat, sIdx) => (
                                <li key={sIdx}>
                                    <Link 
                                        to={`/services?serviceName=${encodeURIComponent(serviceGroup.serviceName || serviceGroup.category)}&category=${encodeURIComponent(cat.category)}`}
                                        className="text-decoration-none text-muted small hover-text-dark"
                                    >
                                        {cat.category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorySEOFooter;
