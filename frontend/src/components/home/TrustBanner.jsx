import React from 'react';
import { FaStar, FaUsers } from 'react-icons/fa';

const TrustBanner = () => {
    return (
        <div className="container mb-5">
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 py-3 border-top border-bottom">
                <div className="d-flex align-items-center gap-3 px-3">
                    <div className="bg-light p-2 rounded-circle">
                        <FaStar className="text-dark" size={20} />
                    </div>
                    <div>
                        <div className="fw-bold fs-5 text-dark">4.8</div>
                        <div className="text-muted small">Service Rating</div>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3 px-3 border-start">
                    <div className="bg-light p-2 rounded-circle">
                        <FaUsers className="text-dark" size={20} />
                    </div>
                    <div>
                        <div className="fw-bold fs-5 text-dark">1M+</div>
                        <div className="text-muted small">Customers Globally</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustBanner;
