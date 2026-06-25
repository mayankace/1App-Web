import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanner = ({ title, subtitle, bgImage, btnText, darkText = false }) => {
    return (
        <div className="container mb-5">
            <div 
                className="rounded-4 overflow-hidden position-relative d-flex align-items-center"
                style={{ 
                    minHeight: '200px', 
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Overlay for readability */}
                <div className={`position-absolute top-0 start-0 w-100 h-100 bg-${darkText ? 'light' : 'dark'} opacity-50`}></div>
                
                <div className="position-relative z-1 p-4 p-md-5 w-100 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className={`fw-extrabold mb-1 ${darkText ? 'text-dark' : 'text-white'}`}>{title}</h2>
                        <p className={`mb-0 ${darkText ? 'text-secondary' : 'text-light'}`}>{subtitle}</p>
                    </div>
                    {btnText && (
                        <Link to="/services" className={`btn ${darkText ? 'btn-dark' : 'btn-light'} fw-bold px-4 py-2 rounded-pill shadow-sm`}>
                            {btnText}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromoBanner;
