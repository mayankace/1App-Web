import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaHome, FaBriefcase, FaLaptop, FaBullhorn, FaChartBar,
    FaUserMd, FaHeartbeat, FaGraduationCap, FaCalendarAlt,
    FaPalette, FaBus, FaTools, FaWrench, FaBolt, FaSnowflake,
    FaTint, FaUser, FaCar, FaTimes, FaShieldAlt, FaCamera,
    FaChartLine, FaCode, FaMobileAlt, FaDatabase, FaCloud,
    FaCut, FaSpa, FaHammer, FaLeaf, FaDumbbell, FaStethoscope,
    FaTruck, FaTaxi, FaMotorcycle, FaMusic, FaVideo,
    FaFileAlt, FaBalanceScale, FaCalculator, FaMoneyBillWave,
    FaPaintBrush, FaStar, FaBoxOpen, FaUtensils
} from 'react-icons/fa';

// Map subcategory names to icons
const subcategoryIconMap = {
    // Cleaning
    'Home Deep Cleaning': <FaHome />,
    'Bathroom Cleaning': <FaTint />,
    'Kitchen Cleaning': <FaUtensils />,
    'Sofa & Carpet Cleaning': <FaHome />,
    'Water Tank Cleaning': <FaTint />,

    // Plumbing
    'Pipe Repair': <FaTools />,
    'Tap & Faucet': <FaTools />,
    'Drainage & Blockage': <FaTools />,

    // Electrical
    'Wiring & Fittings': <FaBolt />,
    'Switch & Socket': <FaBolt />,
    'Fan Installation': <FaBolt />,

    // Handyman
    'Furniture Assembly': <FaHammer />,
    'Door & Window Repair': <FaHammer />,
    'Painting': <FaPaintBrush />,
    'Carpentry': <FaHammer />,

    // AC & Appliance
    'AC Service': <FaSnowflake />,
    'Refrigerator Repair': <FaBoxOpen />,
    'Washing Machine Repair': <FaTools />,
    'Microwave Repair': <FaTools />,

    // Grooming
    'Haircut at Home': <FaCut />,
    'Beard Grooming': <FaUser />,
    'Hair Spa': <FaSpa />,

    // Beauty & Personal Care
    'Salon for Women': <FaPalette />,
    'Spa for Women': <FaSpa />,
    'Hair Studio for Women': <FaCut />,
    'Makeup, Saree & Styling': <FaPalette />,
    'Facial & Skincare': <FaPalette />,
    'Waxing & Threading': <FaPalette />,

    // IT & Technology
    'Web Design': <FaLaptop />,
    'Software Development': <FaCode />,
    'Mobile App Development': <FaMobileAlt />,
    'IT Support': <FaLaptop />,
    'Database Management': <FaDatabase />,
    'Cloud Services': <FaCloud />,
    'Cybersecurity': <FaShieldAlt />,

    // Marketing & Branding
    'Social Media Marketing': <FaBullhorn />,
    'SEO & Content': <FaChartLine />,
    'Branding & Design': <FaPalette />,
    'Video Marketing': <FaVideo />,
    'Photography': <FaCamera />,

    // Accounting & Finance
    'Tax Consulting': <FaCalculator />,
    'Bookkeeping': <FaChartBar />,
    'Financial Planning': <FaMoneyBillWave />,
    'Auditing': <FaFileAlt />,

    // Professional Services
    'Legal Consulting': <FaBalanceScale />,
    'HR & Recruitment': <FaUserMd />,
    'Business Strategy': <FaBriefcase />,

    // Health & Wellness
    'Doctor Consultation': <FaStethoscope />,
    'Physiotherapy': <FaDumbbell />,
    'Yoga & Meditation': <FaLeaf />,
    'Nutrition Counseling': <FaHeartbeat />,

    // Education
    'Home Tutoring': <FaGraduationCap />,
    'Online Courses': <FaLaptop />,
    'Music Classes': <FaMusic />,
    'Language Learning': <FaGraduationCap />,

    // Events & Media
    'Event Planning': <FaCalendarAlt />,
    'Photography & Videography': <FaCamera />,
    'DJ & Entertainment': <FaMusic />,
    'Catering': <FaUtensils />,

    // Transportation
    'Cab Booking': <FaTaxi />,
    'Truck & Movers': <FaTruck />,
    'Bike Delivery': <FaMotorcycle />,
    'Corporate Transport': <FaBus />,
};

// Default icon per category
const categoryDefaultIcon = {
    'Home Services': <FaHome />,
    'Business Services': <FaBriefcase />,
    'IT & Technology': <FaLaptop />,
    'Marketing & Branding': <FaBullhorn />,
    'Accounting & Finance': <FaChartBar />,
    'Professional Services': <FaUserMd />,
    'Health & Wellness': <FaHeartbeat />,
    'Education': <FaGraduationCap />,
    'Events & Media': <FaCalendarAlt />,
    'Beauty & Personal Care': <FaPalette />,
    'Transportation Services': <FaBus />,
    'Cleaning': <FaHome />,
    'Plumbing': <FaTools />,
    'Electrical': <FaBolt />,
    'Handyman': <FaWrench />,
    'AC & Appliance': <FaSnowflake />,
    'Grooming': <FaUser />,
};

const getSubcategoryIcon = (subcategory, category) => {
    if (subcategoryIconMap[subcategory]) return subcategoryIconMap[subcategory];
    if (categoryDefaultIcon[category]) return categoryDefaultIcon[category];
    return <FaStar />;
};

// Pastel background colors cycling for subcategory tiles
const tileBgColors = [
    '#f5f0eb', '#f0f4ff', '#f0fff4', '#fff8f0',
    '#fdf0ff', '#f0faff', '#fffff0', '#fff0f5',
];

const CategoryPopup = ({ category, subcategories, onClose }) => {
    const navigate = useNavigate();

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleSubcategoryClick = (subcategory) => {
        onClose();
        navigate(`/services?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`);
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.45)',
                zIndex: 1050,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '36px 32px 32px',
                    maxWidth: '620px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        width: '36px', height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#f0f0f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#333',
                    }}
                >
                    <FaTimes />
                </button>

                {/* Title */}
                <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '28px', color: '#111' }}>
                    {category}
                </h2>

                {/* Subcategory Grid */}
                {subcategories.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', padding: '24px 0' }}>
                        No subcategories available yet.
                    </p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '16px',
                    }}>
                        {subcategories.map((sub, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleSubcategoryClick(sub)}
                                style={{
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    padding: '16px 8px',
                                    borderRadius: '14px',
                                    background: tileBgColors[idx % tileBgColors.length],
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '12px',
                                    background: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 10px',
                                    fontSize: '26px',
                                    color: '#444',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                }}>
                                    {getSubcategoryIcon(sub, category)}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#1a73e8',
                                    fontWeight: 500,
                                    lineHeight: 1.4,
                                    wordBreak: 'break-word',
                                }}>
                                    {sub}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPopup;
