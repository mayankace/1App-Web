import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import serviceService from '../services/serviceService';
import CategoryPopup from '../components/CategoryPopup';
import {
    FaSearch, FaStar, FaUsers, FaTag, FaHome, FaBriefcase,
    FaLaptop, FaBullhorn, FaChartLine, FaUserMd, FaHeartbeat,
    FaGraduationCap, FaCalendarAlt, FaPalette, FaCar, FaShieldAlt,
    FaTools, FaWrench, FaPaintRoller, FaBolt, FaSnowflake,
    FaTint, FaUser, FaClock, FaArrowRight, FaPhone, FaMapMarkerAlt,
    FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaYoutube,
    FaWhatsapp, FaAppStore, FaGooglePlay, FaCamera, FaShoppingBag,
    FaUserCircle, FaChartBar, FaBus
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredServices, setFeaturedServices] = useState([]);
    const [mostBooked, setMostBooked] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [popupCategory, setPopupCategory] = useState(null);   // { label, subcategories }
    const [subcategoryMap, setSubcategoryMap] = useState({});    // { categoryName: [sub1, sub2, ...] }

    // Category icons mapping
    const categoryIcons = {
        'Cleaning': <FaHome />,
        'Plumbing': <FaTools />,
        'Electrical': <FaBolt />,
        'Handyman': <FaWrench />,
        'AC & Appliance': <FaSnowflake />,
        'Grooming': <FaUser />,
        'Beauty & Personal Care': <FaPalette />,
        'IT Support': <FaLaptop />,
        'Web Design': <FaLaptop />,
        'Software Development': <FaLaptop />,
        'Consulting': <FaBriefcase />,
        'Marketing': <FaBullhorn />,
        'Ride Services': <FaCar />,
        'Education': <FaGraduationCap />,
        'Events & Media': <FaCalendarAlt />,
        'Legal Services': <FaUserMd />,
        'Home Services': <FaHome />,
        'Business Services': <FaBriefcase />,
        'IT & Technology': <FaLaptop />,
        'Marketing & Branding': <FaBullhorn />,
        'Accounting & Finance': <FaChartBar />,
        'Professional Services': <FaUserMd />,
        'Health & Wellness': <FaHeartbeat />,
        'Transportation Services': <FaBus />,
    };

    // Hero grid categories (grouped from API or fallback labels)
    const heroCategories = [
        { label: 'Cleaning', icon: <FaHome size={28} /> },
        { label: 'Consulting', icon: <FaBriefcase size={28} /> },
        { label: 'IT\nSupport', icon: <FaLaptop size={28} /> },
        { label: 'Marketing\n& Branding', icon: <FaBullhorn size={28} /> },
        { label: 'Accounting\nand\nFinance', icon: <FaChartBar size={28} /> },
        { label: 'Legal\nServices', icon: <FaUserMd size={28} /> },
        { label: 'Health &\nWellness', icon: <FaHeartbeat size={28} /> },
        { label: 'Education', icon: <FaGraduationCap size={28} /> },
        { label: 'Events\n& Media', icon: <FaCalendarAlt size={28} /> },
        { label: 'Beauty &\nPersonal Care', icon: <FaPalette size={28} /> },
        { label: 'Ride\nServices', icon: <FaBus size={28} /> },
    ];

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('vmarc_token');
        setIsAuthenticated(!!token);
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        setLoading(true);
        try {
            // Fetch all services
            const servicesRes = await serviceService.getAllServices();
            if (servicesRes.success) {
                const allServices = servicesRes.data.services;
                setServices(allServices);

                // Featured services (first 5)
                setFeaturedServices(allServices.slice(0, 5));

                // Most booked (sort by ratings)
                const sorted = [...allServices].sort((a, b) =>
                    (b.ratingsAverage || 0) - (a.ratingsAverage || 0)
                );
                setMostBooked(sorted.slice(0, 4));

                // Build subcategory map from services
                const subMap = {};
                allServices.forEach(s => {
                    if (!s.category || !s.subcategory || s.subcategory === 'General') return;
                    if (!subMap[s.category]) subMap[s.category] = new Set();
                    subMap[s.category].add(s.subcategory);
                });
                // Convert Sets to arrays
                const finalMap = {};
                Object.keys(subMap).forEach(k => { finalMap[k] = Array.from(subMap[k]); });
                setSubcategoryMap(finalMap);
            }

            // Fetch categories
            const catRes = await serviceService.getCategories();
            if (catRes.success) {
                setCategories(catRes.data.categories);
            }
        } catch (err) {
            toast.error('Failed to load homepage data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleCategoryClick = (category) => {
        // Normalize label (remove line breaks)
        const normalizedCategory = category.replace(/\n/g, ' ');

        // Find matching subcategories from the map
        // Try exact match first, then partial match
        let subcategories = subcategoryMap[normalizedCategory] || [];

        if (subcategories.length === 0) {
            // Try partial key match (e.g. hero label "IT & Technology" vs key "IT & Technology")
            const matchedKey = Object.keys(subcategoryMap).find(
                k => k.toLowerCase().includes(normalizedCategory.toLowerCase()) ||
                    normalizedCategory.toLowerCase().includes(k.toLowerCase())
            );
            if (matchedKey) subcategories = subcategoryMap[matchedKey];
        }

        if (subcategories.length > 0) {
            setPopupCategory({ label: normalizedCategory, subcategories });
        } else {
            // No subcategories found — navigate directly
            navigate(`/services?category=${encodeURIComponent(normalizedCategory)}`);
        }
    };

    const handleClosePopup = useCallback(() => setPopupCategory(null), []);

    // Navigate to service detail page
    const handleServiceClick = (serviceId) => {
        navigate(`/service/${serviceId}`);
    };

    // Handle book now - check auth then navigate to service detail
    const handleBookNow = (serviceId, e) => {
        e.stopPropagation(); // Prevent triggering the parent card click
        const token = localStorage.getItem('vmarc_token');
        if (!token) {
            toast.warning('Please login to book services');
            navigate('/login');
            return;
        }
        navigate(`/service/${serviceId}`);
    };

    const handleViewAllServices = (category) => {
        navigate(`/services?category=${encodeURIComponent(category)}`);
    };

    const getCategoryServices = (categoryName) => {
        return services.filter(s => s.category === categoryName && s.subcategory !== 'General').slice(0, 4);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="text-warning" style={{ fontSize: '12px' }} />);
        }
        if (hasHalfStar) {
            stars.push(<FaStar key="half" className="text-warning" style={{ fontSize: '12px', opacity: 0.5 }} />);
        }
        return stars;
    };

    // Helper to resolve hero image path (falls back gracefully)
    const tryHeroImg = (filename) => {
        try { return require(`../assets/hero/${filename}`); }
        catch { return ''; }
    };

    if (loading) {
        return <LoadingSpinner message="Loading your services..." />;
    }

    return (
        <div className="home-page">

            {/* Category Popup */}
            {popupCategory && (
                <CategoryPopup
                    category={popupCategory.label}
                    subcategories={popupCategory.subcategories}
                    onClose={handleClosePopup}
                />
            )}

            {/* Hero Section */}
            <section className="hero-section bg-white py-5">
                <div className="container py-3">
                    <div className="row align-items-center g-5">
                        {/* Left: Title + Category Grid */}
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4" style={{ color: '#111', lineHeight: 1.2 }}>
                                At your Ease, At your Doorsteps!
                            </h1>
                            <div className="hero-category-box border rounded-4 p-4">
                                <div className="row g-3">
                                    {heroCategories.map((cat, idx) => (
                                        <div key={idx} className="col-3">
                                            <div
                                                className="hero-cat-item text-center p-2 rounded-3"
                                                onClick={() => handleCategoryClick(cat.label.replace(/\n/g, ' '))}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="hero-cat-icon mb-2 d-flex align-items-center justify-content-center mx-auto"
                                                    style={{ width: 54, height: 54, background: '#f5f5f5', borderRadius: 12 }}>
                                                    <span className="text-dark">{cat.icon}</span>
                                                </div>
                                                <div className="hero-cat-label" style={{ fontSize: '11px', color: '#333', lineHeight: 1.3 }}>
                                                    {cat.label.split('\n').map((line, i) => (
                                                        <span key={i}>{line}{i < cat.label.split('\n').length - 1 && <br />}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: 2x2 Image Grid - img1&4 taller, img2&3 shorter */}
                        <div className="col-lg-6">
                            <div className="d-flex gap-3" style={{ height: '460px' }}>
                                {/* Left column: img1 tall (62%), img3 short (38%) */}
                                <div className="d-flex flex-column gap-3" style={{ flex: '0 0 57%' }}>
                                    <div style={{ flex: '0 0 62%', borderRadius: '16px', overflow: 'hidden' }}>
                                        <img src={tryHeroImg('hero1.png')} alt="IT Support" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                        <div style={{ width: '100%', height: '100%', display: 'none', background: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}><FaLaptop size={48} className="text-muted" /></div>
                                    </div>
                                    <div style={{ flex: '0 0 34%', borderRadius: '16px', overflow: 'hidden' }}>
                                        <img src={tryHeroImg('hero3.png')} alt="Cleaning" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                        <div style={{ width: '100%', height: '100%', display: 'none', background: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}><FaSnowflake size={36} className="text-muted" /></div>
                                    </div>
                                </div>
                                {/* Right column: img2 short (38%), img4 tall (62%) */}
                                <div className="d-flex flex-column gap-3" style={{ flex: '0 0 40%' }}>
                                    <div style={{ flex: '0 0 34%', borderRadius: '16px', overflow: 'hidden' }}>
                                        <img src={tryHeroImg('hero2.png')} alt="Taxi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                        <div style={{ width: '100%', height: '100%', display: 'none', background: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}><FaCar size={36} className="text-muted" /></div>
                                    </div>
                                    <div style={{ flex: '0 0 62%', borderRadius: '16px', overflow: 'hidden' }}>
                                        <img src={tryHeroImg('hero4.png')} alt="Health" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                        <div style={{ width: '100%', height: '100%', display: 'none', background: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}><FaGraduationCap size={36} className="text-muted" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="row mt-5 pt-3 border-top">
                        <div className="col-auto d-flex align-items-center gap-3">
                            <FaStar size={28} className="text-dark" />
                            <span className="fw-bold fs-3">4.8</span>
                            <span className="text-muted fs-5">Service Rating*</span>
                        </div>
                        <div className="col-auto d-flex align-items-center gap-3 ms-5">
                            <span className="fw-bold fs-3">12M+</span>
                            <span className="text-muted fs-5">Customers Globally*</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offers & Discounts Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <h2 className="fw-bold mb-4">Offers &amp; discounts</h2>
                    <div className="row g-4">
                        {/* Card 1 - Wall Panels */}
                        <div className="col-md-4">
                            <div className="rounded-4 overflow-hidden d-flex" style={{ background: '#f5f0eb', minHeight: '180px' }}>
                                <div className="p-4 d-flex flex-column justify-content-between" style={{ flex: 1 }}>
                                    <div>
                                        <p className="text-uppercase small fw-semibold mb-1" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>At Home Consultation</p>
                                        <h5 className="fw-bold mb-2">Wall panels</h5>
                                        <p className="text-muted small">Transform your home in a day</p>
                                    </div>
                                    <button className="btn btn-outline-dark btn-sm rounded-pill px-3" style={{ width: 'fit-content' }}>Explore</button>
                                </div>
                                <div style={{ width: '120px', flexShrink: 0, background: 'linear-gradient(135deg, #c8c8b8 0%, #a8a898 100%)' }} className="d-flex align-items-center justify-content-center">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', padding: '10px' }}>
                                        {Array(12).fill(0).map((_, i) => (
                                            <div key={i} style={{ width: '28px', height: '18px', background: i % 2 === 0 ? '#d4d4c4' : '#b8b8a8', borderRadius: '2px' }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - AC Service */}
                        <div className="col-md-4">
                            <div className="rounded-4 overflow-hidden d-flex" style={{ background: '#f0f4ff', minHeight: '180px' }}>
                                <div className="p-4 d-flex flex-column justify-content-between" style={{ flex: 1 }}>
                                    <div>
                                        <h5 className="fw-bold mb-1">Deep clean with foam-jet AC service</h5>
                                        <p className="text-muted small">AC service &amp; repair</p>
                                    </div>
                                    <button className="btn btn-dark btn-sm rounded-pill px-3" style={{ width: 'fit-content' }}>Book now</button>
                                </div>
                                <div style={{ width: '120px', flexShrink: 0, background: 'linear-gradient(160deg, #1a2a4a 0%, #2a4a6a 100%)' }} className="d-flex align-items-center justify-content-center">
                                    <div className="text-center text-white">
                                        <div className="fw-bold" style={{ fontSize: '28px', lineHeight: 1 }}>AC</div>
                                        <div className="fw-bold" style={{ fontSize: '14px' }}>SERVICE</div>
                                        <div style={{ fontSize: '9px', opacity: 0.7, marginTop: '4px' }}>MODERN COOLING TECH</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 - Kitchen Cleaning */}
                        <div className="col-md-4">
                            <div className="rounded-4 overflow-hidden d-flex" style={{ background: '#0d5c4a', minHeight: '180px' }}>
                                <div className="p-4 d-flex flex-column justify-content-between" style={{ flex: 1 }}>
                                    <h5 className="fw-bold text-white">Kitchen cleaning starting at ₹399 only</h5>
                                    <button className="btn btn-outline-light btn-sm rounded-pill px-3" style={{ width: 'fit-content' }}>Book now</button>
                                </div>
                                <div style={{ width: '80px', flexShrink: 0, background: 'linear-gradient(180deg, #0a9e7a 0%, #07856a 100%)', borderRadius: '0 16px 16px 0' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New & Noteworthy Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <h2 className="fw-bold mb-4">New and noteworthy</h2>
                    <div className="d-flex gap-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {featuredServices.map((service, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleServiceClick(service._id)}
                                style={{ cursor: 'pointer', minWidth: '200px', flex: '0 0 auto' }}
                            >
                                <div
                                    className="rounded-4 overflow-hidden mb-3"
                                    style={{ height: '200px', background: '#f0f0f0' }}
                                >
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory || service.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                            <FaTools size={40} className="text-muted" />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="fw-semibold text-dark" style={{ fontSize: '15px' }}>{service.subcategory || service.name}</span>
                                    {idx === featuredServices.length - 1 && (
                                        <span className="text-success fw-semibold small ms-2" style={{ whiteSpace: 'nowrap' }}>● In 45 mins</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Most Booked Services */}
            <section className="py-5 bg-white">
                <div className="container">
                    <h2 className="fw-bold mb-4">Most booked services</h2>
                    <div className="d-flex gap-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {mostBooked.map((service, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleServiceClick(service._id)}
                                style={{ cursor: 'pointer', minWidth: '200px', flex: '0 0 auto' }}
                            >
                                <div
                                    className="rounded-4 overflow-hidden mb-3"
                                    style={{ height: '200px', background: '#f0f0f0' }}
                                >
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory || service.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                            <FaTools size={40} className="text-muted" />
                                        </div>
                                    )}
                                </div>
                                <div className="fw-semibold text-dark mb-1" style={{ fontSize: '15px' }}>{service.subcategory || service.name}</div>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <FaStar className="text-dark" style={{ fontSize: '12px' }} />
                                    <span className="small fw-semibold">{service.ratingsAverage || 4.8}</span>
                                    <span className="text-muted small">· Instant</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold">₹{service.price}</span>
                                    {service.originalPrice && (
                                        <span className="text-muted small text-decoration-line-through">₹{service.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Wall Panels + Smart Locks Banner */}
            <section className="py-5 bg-white">
                <div className="container">

                    {/* Card 1 - Wall Panels */}
                    <div className="rounded-4 overflow-hidden d-flex mb-4" style={{ background: '#f7f0ea', minHeight: '220px' }}>
                        <div className="p-5 d-flex flex-column justify-content-center" style={{ flex: '0 0 45%' }}>
                            <h2 className="fw-bold mb-2" style={{ color: '#1a1a1a', fontSize: '2rem' }}>Wall Panels</h2>
                            <p className="text-muted mb-4">Level up your walls</p>
                            <button className="btn btn-dark rounded-3 px-4 py-2" style={{ width: 'fit-content' }}>Know more</button>
                        </div>
                        <div style={{ flex: '0 0 55%', minHeight: '220px', overflow: 'hidden' }}>
                            <img
                                src={tryHeroImg('wallpanel.png')}
                                alt="Wall Panels"
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="w-100 h-100 align-items-center justify-content-center bg-secondary" style={{ display: 'none', minHeight: '220px' }}>
                                <FaHome size={60} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - Smart Locks */}
                    <div className="rounded-4 overflow-hidden position-relative" style={{ minHeight: '280px', background: '#2a2018' }}>
                        <img
                            src={tryHeroImg('smartlock.png')}
                            alt="Smart Locks"
                            className="position-absolute w-100 h-100"
                            style={{ objectFit: 'cover', top: 0, left: 0, opacity: 0.7 }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="position-relative p-5 d-flex flex-column justify-content-center" style={{ minHeight: '280px', maxWidth: '340px' }}>
                            <span
                                className="fw-semibold text-white px-3 py-1 rounded-pill mb-4"
                                style={{ background: '#2e7d32', fontSize: '11px', width: 'fit-content', letterSpacing: '0.5px' }}
                            >
                                UP TO ₹1,700 OFF
                            </span>
                            <p className="text-white mb-1" style={{ fontSize: '13px', opacity: 0.8 }}>ONE-APP</p>
                            <h2 className="fw-bold text-white mb-3" style={{ fontSize: '2.5rem' }}>Smart locks</h2>
                            <p className="text-white mb-4" style={{ opacity: 0.85, lineHeight: 1.8 }}>
                                Camera.<br />Doorbell.<br />All-in one.
                            </p>
                            <button className="btn btn-light rounded-3 px-4 py-2 fw-semibold" style={{ width: 'fit-content' }}>Buy now</button>
                        </div>
                    </div>

                </div>
            </section>

            {/* Cleaning Essentials */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Cleaning Essentials</h2>
                            <p className="text-muted small mb-0">Monthly cleaning essential services</p>
                        </div>
                        <button onClick={() => handleViewAllServices('Cleaning')} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">
                            See all
                        </button>
                    </div>
                    <div className="d-flex gap-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {getCategoryServices('Cleaning').map((service, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleServiceClick(service._id)}
                                style={{ cursor: 'pointer', minWidth: '220px', flex: '0 0 auto' }}
                            >
                                <div className="rounded-4 overflow-hidden mb-3" style={{ height: '220px', background: '#f0f0f0' }}>
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                            <FaTools size={40} className="text-muted" />
                                        </div>
                                    )}
                                </div>
                                <div className="fw-semibold text-dark mb-1" style={{ fontSize: '15px' }}>{service.subcategory}</div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold">₹{service.price}</span>
                                    {service.originalPrice && (
                                        <span className="text-muted small text-decoration-line-through">₹{service.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Home Painting Banner */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="rounded-4 overflow-hidden d-flex" style={{ background: '#fdfdf0', minHeight: '200px' }}>
                        <div className="p-5 d-flex flex-column justify-content-center" style={{ flex: '0 0 45%' }}>
                            <h2 className="fw-bold mb-2" style={{ color: '#1a1a1a', fontSize: '1.6rem', lineHeight: 1.3 }}>Give your space the glow-up it deserves</h2>
                            <p className="text-muted mb-4">Home painting</p>
                            <button className="btn btn-dark rounded-3 px-4 py-2" style={{ width: 'fit-content' }}>Buy now</button>
                        </div>
                        <div style={{ flex: '0 0 55%', overflow: 'hidden' }}>
                            <img
                                src={tryHeroImg('Home Painting.png')}
                                alt="Home Painting"
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                            <div className="w-100 h-100 align-items-center justify-content-center bg-light" style={{ display: 'none', minHeight: '200px' }}>
                                <FaPaintRoller size={60} className="text-muted" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Appliance Repair */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Appliance repair &amp; service</h2>
                            <p className="text-muted small mb-0">Expert repair for all home appliances</p>
                        </div>
                        <button onClick={() => handleViewAllServices('AC & Appliance')} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See all</button>
                    </div>
                    <div className="d-flex gap-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {getCategoryServices('AC & Appliance').map((service, idx) => (
                            <div key={idx} onClick={() => handleServiceClick(service._id)} style={{ cursor: 'pointer', minWidth: '220px', flex: '0 0 auto' }}>
                                <div className="rounded-4 overflow-hidden mb-3" style={{ height: '220px', background: '#f0f0f0' }}>
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"><FaTools size={40} className="text-muted" /></div>
                                    )}
                                </div>
                                <div className="fw-semibold text-dark mb-1" style={{ fontSize: '15px' }}>{service.subcategory}</div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold">₹{service.price}</span>
                                    {service.originalPrice && <span className="text-muted small text-decoration-line-through">₹{service.originalPrice}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Home Repair & Installation */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Home repair &amp; installation</h2>
                            <p className="text-muted small mb-0">Trusted handyman services at your door</p>
                        </div>
                        <button onClick={() => handleViewAllServices('Handyman')} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See all</button>
                    </div>
                    <div className="d-flex gap-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {getCategoryServices('Handyman').map((service, idx) => (
                            <div key={idx} onClick={() => handleServiceClick(service._id)} style={{ cursor: 'pointer', minWidth: '220px', flex: '0 0 auto' }}>
                                <div className="rounded-4 overflow-hidden mb-3" style={{ height: '220px', background: '#f0f0f0' }}>
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"><FaWrench size={40} className="text-muted" /></div>
                                    )}
                                </div>
                                <div className="fw-semibold text-dark mb-1" style={{ fontSize: '15px' }}>{service.subcategory}</div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold">₹{service.price}</span>
                                    {service.originalPrice && <span className="text-muted small text-decoration-line-through">₹{service.originalPrice}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Beauty & Personal Care */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Beauty &amp; Personal Care</h2>
                            <p className="text-muted small mb-0">Professional beauty services at home</p>
                        </div>
                        <button onClick={() => handleViewAllServices('Beauty & Personal Care')} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See all</button>
                    </div>
                    <div className="d-flex gap-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {getCategoryServices('Beauty & Personal Care').map((service, idx) => (
                            <div key={idx} onClick={() => handleServiceClick(service._id)} style={{ cursor: 'pointer', minWidth: '220px', flex: '0 0 auto' }}>
                                <div className="rounded-4 overflow-hidden mb-3 position-relative" style={{ height: '220px', background: '#f0f0f0' }}>
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"><FaPalette size={40} className="text-muted" /></div>
                                    )}
                                </div>
                                <div className="fw-semibold text-dark mb-1" style={{ fontSize: '15px' }}>{service.subcategory}</div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold">₹{service.price}</span>
                                    {service.originalPrice && <span className="text-muted small text-decoration-line-through">₹{service.originalPrice}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RO Water Purifier Banner */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="rounded-4 overflow-hidden d-flex" style={{ background: '#d6d9e0', minHeight: '220px' }}>
                        <div className="p-5 d-flex flex-column justify-content-center" style={{ flex: '0 0 45%' }}>
                            <span className="fw-semibold text-white px-3 py-1 rounded-2 mb-3" style={{ background: '#2e7d32', fontSize: '11px', width: 'fit-content' }}>UP TO ₹3,100 OFF</span>
                            <p className="mb-1" style={{ fontSize: '12px', color: '#444', letterSpacing: '0.5px' }}>ONE-APP</p>
                            <h2 className="fw-bold mb-2" style={{ color: '#1a1a1a', fontSize: '2rem', lineHeight: 1.2 }}>RO water purifier</h2>
                            <p className="text-muted mb-4">Needs no service for 2 years</p>
                            <button className="btn btn-light border rounded-3 px-4 py-2 fw-semibold" style={{ width: 'fit-content' }}>Buy now</button>
                        </div>
                        <div style={{ flex: '0 0 55%', overflow: 'hidden' }}>
                            <img
                                src={tryHeroImg('water-purifier.png')}
                                alt="RO Water Purifier"
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                            <div className="w-100 h-100 align-items-center justify-content-center" style={{ display: 'none', minHeight: '220px', background: '#c8cdd6' }}>
                                <FaTint size={60} className="text-muted" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Personal Care for Men */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Personal Care for men</h2>
                            <p className="text-muted small mb-0">Grooming essentials delivered at home</p>
                        </div>
                        <button onClick={() => handleViewAllServices('Grooming')} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See all</button>
                    </div>
                    <div className="d-flex gap-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {getCategoryServices('Grooming').map((service, idx) => (
                            <div key={idx} onClick={() => handleServiceClick(service._id)} style={{ cursor: 'pointer', minWidth: '220px', flex: '0 0 auto' }}>
                                <div className="rounded-4 overflow-hidden mb-3" style={{ height: '220px', background: '#f0f0f0' }}>
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"><FaUser size={40} className="text-muted" /></div>
                                    )}
                                </div>
                                <div className="fw-semibold text-dark mb-1" style={{ fontSize: '15px' }}>{service.subcategory}</div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold">₹{service.price}</span>
                                    {service.originalPrice && <span className="text-muted small text-decoration-line-through">₹{service.originalPrice}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ride Safe */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Ride Safe With 1-App</h2>
                            <p className="text-muted small mb-0">Safe and reliable ride services</p>
                        </div>
                        <button onClick={() => handleViewAllServices('Ride Services')} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See all</button>
                    </div>
                    <div className="d-flex gap-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {getCategoryServices('Ride Services').map((service, idx) => (
                            <div key={idx} onClick={() => handleServiceClick(service._id)} style={{ cursor: 'pointer', minWidth: '220px', flex: '0 0 auto' }}>
                                <div className="rounded-4 overflow-hidden mb-3" style={{ height: '220px', background: '#f0f0f0' }}>
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"><FaCar size={40} className="text-muted" /></div>
                                    )}
                                </div>
                                <div className="fw-semibold text-dark mb-1" style={{ fontSize: '15px' }}>{service.subcategory}</div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold">₹{service.price}</span>
                                    {service.originalPrice && <span className="text-muted small text-decoration-line-through">₹{service.originalPrice}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Marketing & Business Services */}
            {[
                { category: 'Marketing & Branding', title: 'Marketing Services' },
                { category: 'Business Services', title: 'Business and Consulting Services' },
                { category: 'Professional Services', title: 'Professional Services' },
                { category: 'Accounting & Finance', title: 'Accounting & Finance Services' },
            ].map(({ category, title }) => {
                const catServices = getCategoryServices(category);
                if (!catServices.length) return null;
                return (
                    <section key={category} className="py-5 bg-white">
                        <div className="container">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="fw-bold mb-0">{title}</h2>
                                <button onClick={() => handleViewAllServices(category)} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See All</button>
                            </div>
                            <div className="row g-3">
                                {catServices.map((service, idx) => (
                                    <div key={idx} className="col-lg-3 col-md-6">
                                        <div
                                            className="border rounded-3 p-3 h-100 d-flex flex-column justify-content-between"
                                            style={{ cursor: 'pointer', background: '#fff' }}
                                            onClick={() => handleServiceClick(service._id)}
                                        >
                                            <div>
                                                <div className="mb-3 p-2 rounded-2 d-inline-block" style={{ background: '#f5f5f5' }}>
                                                    {categoryIcons[service.category] || <FaBriefcase size={18} className="text-muted" />}
                                                </div>
                                                <div className="fw-semibold mb-1" style={{ fontSize: '14px', lineHeight: 1.4 }}>{service.subcategory || service.name}</div>
                                                <div className="text-muted" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                                                    {service.description ? service.description.slice(0, 60) + (service.description.length > 60 ? '.' : '') : 'Strategic growth solutions for your enterprise.'}
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                                                <div>
                                                    <div className="text-muted" style={{ fontSize: '11px' }}>Standard Package</div>
                                                    <div style={{ fontSize: '13px' }}>Starts From <span className="fw-bold">{service.price}</span></div>
                                                </div>
                                                <button
                                                    className="btn p-2 rounded-2"
                                                    style={{ background: '#f5f5f5', border: 'none' }}
                                                    onClick={(e) => { e.stopPropagation(); handleBookNow(service._id, e); }}
                                                >
                                                    <FaPhone size={14} className="text-dark" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* All Home Services Banner */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="rounded-4 overflow-hidden position-relative" style={{ background: '#111', minHeight: '380px' }}>
                        <img
                            src={tryHeroImg('all-services.png')}
                            alt="All Home Services"
                            className="position-absolute h-100"
                            style={{ objectFit: 'cover', top: 0, right: 0, width: '55%', opacity: 0.9 }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        {/* Dark gradient overlay on left */}
                        <div className="position-absolute h-100" style={{ top: 0, left: 0, width: '60%', background: 'linear-gradient(to right, #111 60%, transparent 100%)' }} />
                        <div className="position-relative p-5 d-flex flex-column justify-content-center" style={{ minHeight: '380px', maxWidth: '520px' }}>
                            <span className="fw-bold text-white px-3 py-1 rounded-2 mb-3" style={{ background: '#2e7d32', fontSize: '11px', width: 'fit-content', letterSpacing: '0.5px' }}>ONE APP. ALL SERVICES.</span>
                            <p className="text-white mb-1" style={{ fontSize: '12px', opacity: 0.7, letterSpacing: '1px' }}>ONE-APP</p>
                            <h2 className="fw-bold text-white mb-2" style={{ fontSize: '2.4rem', lineHeight: 1.2 }}>All Home Services<br />in One App</h2>
                            <p className="mb-4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6 }}>Everything your home needs,<br />delivered by trusted experts.</p>
                            {/* Service Icons Grid */}
                            <div className="d-flex flex-wrap gap-0 mb-4" style={{ maxWidth: '420px' }}>
                                {[
                                    { icon: <FaTools />, label: 'Cleaning' },
                                    { icon: <FaTint />, label: 'Plumbing' },
                                    { icon: <FaBolt />, label: 'Electrical' },
                                    { icon: <FaPaintRoller />, label: 'Painting' },
                                    { icon: <FaWrench />, label: 'Carpentry' },
                                    { icon: <FaWrench />, label: 'Handyman' },
                                    { icon: <FaSnowflake />, label: 'AC & Appliance\nRepair' },
                                    { icon: <FaShieldAlt />, label: 'Pest Control' },
                                    { icon: <FaHome />, label: 'Gardening &\nLandscaping' },
                                ].map((item, idx) => (
                                    <div key={idx} className="d-flex flex-column align-items-center text-center py-2" style={{ width: '20%', borderRight: '1px solid rgba(255,255,255,0.15)', borderBottom: idx < 5 ? '1px solid rgba(255,255,255,0.15)' : 'none', padding: '8px 4px' }}>
                                        <span className="text-white mb-1" style={{ fontSize: '18px', opacity: 0.85 }}>{item.icon}</span>
                                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.3 }}>
                                            {item.label.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && item.label.includes('\n') && <br />}</span>)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Bottom Row */}
                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                <button className="btn btn-light fw-semibold rounded-3 px-4 py-2" onClick={() => navigate('/services')}>Book Now</button>
                                <div className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                    <FaShieldAlt style={{ color: '#4caf50' }} />
                                    <span>Verified Professionals</span>
                                    <span>·</span>
                                    <span>On-time Service</span>
                                    <span>·</span>
                                    <span>Upfront Pricing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exclusive Home Services Offers */}
            <section className="py-5 bg-white">
                <div className="container">
                    <h2 className="fw-bold mb-1">Exclusive Home Services Offers</h2>
                    <p className="text-muted mb-4">Book Cleaner, Plumber, Handyman, Gardner or any one for your home help.</p>
                    <div className="position-relative">
                        <div
                            id="offersScrollRow"
                            className="d-flex gap-4 pb-2"
                            style={{ overflowX: 'auto', scrollbarWidth: 'none', scrollBehavior: 'smooth' }}
                        >
                            {[
                                { badge: 'UP TO ₹500 OFF', title: 'Home Cleaning', desc: 'Deep Cleaning. Sofa Cleaning. Spotless Spaces.', img: 'cleaning-offer.jpg', category: 'Cleaning' },
                                { badge: 'SAME DAY SERVICE', title: 'Plumbing', desc: 'Leak Repairs. Pipe Installation. Water Solutions.', img: 'plumbing-offer.jpg', category: 'Plumbing' },
                                { badge: 'CERTIFIED EXPERTS', title: 'Electrical', desc: 'Switches. Wiring. Safe Installations.', img: 'electrical-offer.jpg', category: 'Electrical' },
                                { badge: 'UP TO ₹300 OFF', title: 'Handyman', desc: 'Repairs. Installations. Fix Anything.', img: 'handyman-offer.jpg', category: 'Handyman' },
                                { badge: 'SAME DAY SERVICE', title: 'AC & Appliance', desc: 'AC Service. Appliance Repair. Quick Fix.', img: 'ac-offer.jpg', category: 'AC & Appliance' },
                                { badge: 'CERTIFIED EXPERTS', title: 'Home Painting', desc: 'Interior. Exterior. Premium Finish.', img: 'painting-offer.jpg', category: 'Home Services' },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-4 overflow-hidden position-relative flex-shrink-0"
                                    style={{ width: 'calc(33.33% - 12px)', minWidth: '260px', minHeight: '260px', background: '#222', cursor: 'pointer' }}
                                    onClick={() => handleCategoryClick(item.category)}
                                >
                                    <img
                                        src={tryHeroImg(item.img)}
                                        alt={item.title}
                                        className="position-absolute w-100 h-100"
                                        style={{ objectFit: 'cover', top: 0, left: 0, opacity: 0.55 }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <div className="position-relative p-4 d-flex flex-column justify-content-between" style={{ minHeight: '260px' }}>
                                        <div>
                                            <span className="fw-bold text-white px-2 py-1 rounded-2 mb-2 d-inline-block" style={{ background: '#2e7d32', fontSize: '10px', letterSpacing: '0.5px' }}>{item.badge}</span>
                                            <p className="text-white mb-1" style={{ fontSize: '11px', opacity: 0.7, letterSpacing: '1px' }}>ONE-APP</p>
                                            <h4 className="fw-bold text-white mb-2">{item.title}</h4>
                                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</p>
                                        </div>
                                        <button
                                            className="btn btn-light fw-semibold rounded-3 px-4 py-2"
                                            style={{ width: 'fit-content' }}
                                            onClick={(e) => { e.stopPropagation(); handleCategoryClick(item.category); }}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Left Arrow */}
                        <button
                            className="position-absolute d-flex align-items-center justify-content-center border-0 bg-white rounded-circle shadow"
                            style={{ top: '50%', left: '-18px', transform: 'translateY(-50%)', width: '36px', height: '36px', zIndex: 2, cursor: 'pointer' }}
                            onClick={() => { const el = document.getElementById('offersScrollRow'); el.scrollBy({ left: -300, behavior: 'smooth' }); }}
                        >
                            <FaArrowRight style={{ transform: 'rotate(180deg)', fontSize: '14px' }} />
                        </button>
                        {/* Right Arrow */}
                        <button
                            className="position-absolute d-flex align-items-center justify-content-center border-0 bg-white rounded-circle shadow"
                            style={{ top: '50%', right: '-18px', transform: 'translateY(-50%)', width: '36px', height: '36px', zIndex: 2, cursor: 'pointer' }}
                            onClick={() => { const el = document.getElementById('offersScrollRow'); el.scrollBy({ left: 300, behavior: 'smooth' }); }}
                        >
                            <FaArrowRight style={{ fontSize: '14px' }} />
                        </button>
                    </div>
                </div>
            </section>

            {/* IT & Technology Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">IT &amp; Technology</h2>
                        <button onClick={() => handleViewAllServices('IT & Technology')} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See All</button>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-lg-7">
                            <div className="rounded-4 overflow-hidden position-relative" style={{ minHeight: '385px', background: '#1a1a2e', cursor: 'pointer' }} onClick={() => handleCategoryClick('IT & Technology')}>
                                <img src={tryHeroImg('it-featured.png')} alt="Software Development" className="position-absolute w-100 h-100" style={{ objectFit: 'cover', top: 0, left: 0, opacity: 0.6 }} onError={(e) => { e.target.style.display = 'none'; }} />
                                <div className="position-relative p-4 d-flex flex-column justify-content-end" style={{ minHeight: '300px' }}>
                                    <span className="fw-bold text-white px-2 py-1 rounded-2 mb-3 d-inline-block" style={{ background: '#7c3aed', fontSize: '10px', width: 'fit-content' }}>Top Rated</span>
                                    <h4 className="fw-bold text-white mb-2">Custom Software &amp; App Development</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>Build your dream product with our expert development teams.</p>
                                    <button className="btn btn-light fw-semibold rounded-3 px-4 py-2 mt-2" style={{ width: 'fit-content' }} onClick={(e) => { e.stopPropagation(); handleCategoryClick('IT & Technology'); }}>Get a Quote</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 d-flex flex-column gap-3">
                            {[{ icon: <FaLaptop size={20} />, title: 'Web Design', desc: 'Stunning UI/UX for your brand.' }, { icon: <FaUserMd size={20} />, title: 'IT Support', desc: '24/7 technical assistance.' }].map((item, idx) => (
                                <div key={idx} className="rounded-4 border p-4 d-flex flex-column justify-content-between flex-grow-1" style={{ cursor: 'pointer' }} onClick={() => handleCategoryClick('IT & Technology')}>
                                    <div className="mb-3"><div className="mb-3 text-dark">{item.icon}</div><div className="fw-bold mb-1" style={{ fontSize: '15px' }}>{item.title}</div><div className="text-muted small">{item.desc}</div></div>
                                    <button className="btn btn-dark btn-sm rounded-3 px-3" style={{ width: 'fit-content' }} onClick={(e) => { e.stopPropagation(); handleCategoryClick('IT & Technology'); }}>Contact now</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-4 overflow-hidden d-flex" style={{ background: '#faf7f2' }}>
                        <div className="p-5 d-flex flex-column justify-content-between" style={{ flex: '0 0 55%' }}>
                            <div>
                                <h2 className="fw-bold mb-2" style={{ fontSize: '2.2rem', lineHeight: 1.2 }}>IT &amp;<br />Technology<br />&amp; Marketing</h2>
                                <p className="text-muted mb-4">Digital solutions to grow your business</p>
                                <div className="row g-2">
                                    <div className="col-6">
                                        <div className="fw-semibold small mb-2">IT &amp; Technology</div>
                                        {['IT Support', 'Web Design', 'Website Development', 'App Development', 'Software Development'].map((s, i) => (<div key={i} className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '13px', color: '#444', cursor: 'pointer' }} onClick={() => handleCategoryClick('IT & Technology')}><FaLaptop size={10} className="text-muted" />{s}</div>))}
                                    </div>
                                    <div className="col-6">
                                        <div className="fw-semibold small mb-2">Marketing</div>
                                        {['Digital Marketing', 'Social Media Marketing', 'SEO', 'Content Marketing', 'Branding'].map((s, i) => (<div key={i} className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '13px', color: '#444', cursor: 'pointer' }} onClick={() => handleCategoryClick('Marketing & Branding')}><FaBullhorn size={10} className="text-muted" />{s}</div>))}
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-dark rounded-3 px-4 py-2 mt-4" style={{ width: 'fit-content' }} onClick={() => handleCategoryClick('IT & Technology')}>Know more</button>
                        </div>
                        <div style={{ flex: '0 0 45%', position: 'relative', minHeight: '320px' }}>
                            <img src={tryHeroImg('it-marketing.png')} alt="IT & Marketing" className="position-absolute w-100 h-100" style={{ objectFit: 'cover', top: 0, left: 0 }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                            <div className="position-absolute w-100 h-100 align-items-center justify-content-center bg-light" style={{ display: 'none', top: 0, left: 0 }}><FaLaptop size={60} className="text-muted" /></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marketing & Business Services - Dynamic from API */}
            {[
                { category: 'Marketing', title: 'Marketing Services' },
                { category: 'Consulting', title: 'Business and Consulting Services' },
            ].map(({ category, title }) => {
                const catServices = getCategoryServices(category);
                // if (!catServices.length) return null;
                return (
                    <section key={category} className="py-5 bg-white">
                        <div className="container">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="fw-bold mb-0">{title}</h2>
                                <button onClick={() => handleViewAllServices(category)} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See All</button>
                            </div>
                            <div className="row g-3">
                                {catServices.map((service, idx) => (
                                    <div key={idx} className="col-lg-3 col-md-6">
                                        <div
                                            className="border rounded-3 p-3 h-100 d-flex flex-column justify-content-between"
                                            style={{ cursor: 'pointer', background: '#fff' }}
                                            onClick={() => handleServiceClick(service._id)}
                                        >
                                            <div>
                                                <div className="mb-3 p-2 rounded-2 d-inline-block" style={{ background: '#f5f5f5' }}>
                                                    {categoryIcons[service.category] || <FaBriefcase size={18} className="text-muted" />}
                                                </div>
                                                <div className="fw-semibold mb-1" style={{ fontSize: '14px', lineHeight: 1.4 }}>{service.subcategory || service.name}</div>
                                                <div className="text-muted" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                                                    {service.description ? service.description.slice(0, 60) + (service.description.length > 60 ? '.' : '') : 'Strategic growth solutions for your enterprise.'}
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                                                <div>
                                                    <div className="text-muted" style={{ fontSize: '11px' }}>Standard Package</div>
                                                    <div style={{ fontSize: '13px' }}>Starts From <span className="fw-bold">{service.price}</span></div>
                                                </div>
                                                <button className="btn p-2 rounded-2" style={{ background: '#f5f5f5', border: 'none' }} onClick={(e) => { e.stopPropagation(); handleBookNow(service._id, e); }}>
                                                    <FaPhone size={14} className="text-dark" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}



            {/* Elevate Lifestyle Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row g-3">
                        {/* Left dark card */}
                        <div className="col-lg-4">
                            <div className="rounded-4 p-4 h-100 d-flex flex-column justify-content-between" style={{ background: '#1a1a1a', minHeight: '220px' }}>
                                <div>
                                    <h2 className="fw-bold text-white mb-3" style={{ fontSize: '1.8rem', lineHeight: 1.2 }}>Elevate your lifestyle.</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.6 }}>Certified professionals at your doorstep. We prioritize quality, safety, and your peace of mind.</p>
                                </div>
                                <button className="btn btn-light rounded-pill px-4 py-2 fw-semibold" style={{ width: 'fit-content', fontSize: '13px' }}>Join Plus Membership</button>
                            </div>
                        </div>
                        {/* Right 2x2 feature grid */}
                        <div className="col-lg-8">
                            <div className="row g-3 h-100">
                                {[
                                    { icon: <FaShieldAlt size={24} />, label: 'Vetted Experts' },
                                    { icon: <FaClock size={24} />, label: '24/7 Support' },
                                    { icon: <FaTools size={24} />, label: 'Service Warranty' },
                                    { icon: <FaTag size={24} />, label: 'Fair Pricing' },
                                ].map((item, idx) => (
                                    <div key={idx} className="col-6">
                                        <div className="rounded-4 p-4 h-100 d-flex flex-column align-items-start justify-content-center" style={{ background: '#f5f5f5', minHeight: '100px' }}>
                                            <span style={{ color: '#2e7d32', marginBottom: '10px' }}>{item.icon}</span>
                                            <span className="fw-semibold" style={{ fontSize: '14px' }}>{item.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Health & Wellness */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Health &amp; Wellness</h2>
                            <p className="text-muted small mb-0">Holistic care for your body and mind</p>
                        </div>
                        <button onClick={() => handleViewAllServices('Health & Wellness')} className="btn btn-link text-success fw-semibold text-decoration-none p-0" style={{ fontSize: '13px' }}>See all &rsaquo;</button>
                    </div>
                    <div className="row g-4">
                        {getCategoryServices('Health & Wellness').map((service, idx) => (
                            <div key={idx} onClick={() => handleServiceClick(service._id)} className="col-lg-4 col-md-6" style={{ cursor: 'pointer' }}>
                                <div className="rounded-4 overflow-hidden mb-3 position-relative" style={{ height: '220px', background: '#f0f0f0' }}>
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"><FaHeartbeat size={40} className="text-muted" /></div>
                                    )}
                                    {service.badge && (
                                        <span className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded-2 fw-semibold" style={{ background: '#fff', fontSize: '11px' }}>{service.badge}</span>
                                    )}
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                    <div className="fw-bold" style={{ fontSize: '15px' }}>{service.subcategory || service.name}</div>
                                    <div className="d-flex align-items-center gap-1">
                                        <FaStar style={{ color: '#f5a623', fontSize: '12px' }} />
                                        <span className="small fw-semibold">{service.ratingsAverage || 4.8}</span>
                                    </div>
                                </div>
                                <div className="text-muted small">Starts at ₹{service.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Accounting & Finance Banner */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="rounded-4 overflow-hidden position-relative" style={{ minHeight: '300px', background: '#1a1a1a' }}>
                        <img
                            src={tryHeroImg('accounting.png')}
                            alt="Accounting & Finance"
                            className="position-absolute w-100 h-100"
                            style={{ objectFit: 'cover', top: 0, left: 0, opacity: 0.55 }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        {/* left-to-right dark fade */}
                        <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, background: 'linear-gradient(to right, rgba(15,15,15,0.95) 40%, transparent 100%)' }} />
                        <div className="position-relative p-5 d-flex flex-column justify-content-center" style={{ minHeight: '300px', maxWidth: '420px' }}>
                            <span className="fw-bold text-white px-2 py-1 rounded-2 mb-3 d-inline-block" style={{ background: '#2e7d32', fontSize: '10px', width: 'fit-content', letterSpacing: '0.5px' }}>UP TO ₹1,700 OFF</span>
                            <p className="text-white mb-1" style={{ fontSize: '11px', opacity: 0.7, letterSpacing: '1.5px' }}>ONE-APP</p>
                            <h2 className="fw-bold text-white mb-3" style={{ fontSize: '2.2rem', lineHeight: 1.2 }}>Accounting<br />&amp; Finance</h2>
                            <p className="text-white mb-4" style={{ opacity: 0.8, lineHeight: 2, fontSize: '14px' }}>
                                Accounting.<br />Bookkeeping.<br />Tax Services.<br />Financial Consulting.
                            </p>
                            <button className="btn btn-light fw-semibold rounded-3 px-4 py-2" style={{ width: 'fit-content' }} onClick={() => handleCategoryClick('Accounting & Finance')}>Buy now</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accounting and Finance Services */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Accounting &amp; Finance Services</h2>
                            <p className="text-muted small mb-0">Manage your business finances with confidence.</p>
                        </div>
                        <button onClick={() => handleViewAllServices('Accounting and Finance')} className="btn btn-link text-success fw-semibold text-decoration-none p-0" style={{ fontSize: '13px' }}>See all &rsaquo;</button>
                    </div>
                    <div className="row g-3">
                        {getCategoryServices('Accounting and Finance').map((service, idx) => (
                            <div key={idx} onClick={() => handleServiceClick(service._id)} className="col-lg-3 col-md-6" style={{ cursor: 'pointer' }}>
                                <div className="rounded-4 overflow-hidden mb-3 position-relative" style={{ height: '220px', background: '#f0f0f0' }}>
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"><FaHeartbeat size={40} className="text-muted" /></div>
                                    )}
                                    {service.badge && (
                                        <span className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded-2 fw-semibold" style={{ background: '#fff', fontSize: '11px' }}>{service.badge}</span>
                                    )}
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                    <div className="fw-bold" style={{ fontSize: '15px' }}>{service.subcategory || service.name}</div>
                                    <div className="d-flex align-items-center gap-1">
                                        <FaStar style={{ color: '#f5a623', fontSize: '12px' }} />
                                        <span className="small fw-semibold">{service.ratingsAverage || 4.8}</span>
                                    </div>
                                </div>
                                <div className="text-muted small">Starts at ₹{service.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>





            {/* Professional Services Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Professional Services</h2>
                        <button onClick={() => handleViewAllServices('Professional Services')} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See All</button>
                    </div>
                    <div className="row g-3">
                        <div className="col-lg-7">
                            <div className="rounded-4 overflow-hidden position-relative" style={{ minHeight: '385px', background: '#1a1a2e', cursor: 'pointer' }} onClick={() => handleCategoryClick('Professional Services')}>
                                <img src={tryHeroImg('professional.png')} alt="Professional Services" className="position-absolute w-100 h-100" style={{ objectFit: 'cover', top: 0, left: 0, opacity: 0.6 }} onError={(e) => { e.target.style.display = 'none'; }} />
                                <div className="position-relative p-4 d-flex flex-column justify-content-end" style={{ minHeight: '300px' }}>
                                    <span className="fw-bold text-white px-2 py-1 rounded-2 mb-3 d-inline-block" style={{ background: '#7c3aed', fontSize: '10px', width: 'fit-content' }}>Top Rated</span>
                                    <h4 className="fw-bold text-white mb-2">HR Services ( IT &amp; Non-It )</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>Build your dream team with our expert HR teams.</p>
                                    <button className="btn btn-light fw-semibold rounded-3 px-4 py-2 mt-2" style={{ width: 'fit-content' }} onClick={(e) => { e.stopPropagation(); handleCategoryClick('Professional Services'); }}>Get a Quote</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 d-flex flex-column gap-3">
                            {[
                                { icon: <FaUserMd size={20} />, title: 'Legal Services', desc: 'Get legal advice from top expert consultants' },
                                { icon: <FaPhone size={20} />, title: 'Translation Services', desc: '24/7 translation assistance in multiple languages.' },
                            ].map((item, idx) => (
                                <div key={idx} className="rounded-4 border p-4 d-flex flex-column justify-content-between flex-grow-1" style={{ cursor: 'pointer' }} onClick={() => handleCategoryClick('Professional Services')}>
                                    <div>
                                        <div className="mb-3 text-dark">{item.icon}</div>
                                        <div className="fw-bold mb-1" style={{ fontSize: '15px' }}>{item.title}</div>
                                        <div className="text-muted small mb-3">{item.desc}</div>
                                    </div>
                                    <button className="btn btn-dark btn-sm rounded-3 px-3" style={{ width: 'fit-content' }} onClick={(e) => { e.stopPropagation(); handleCategoryClick('Professional Services'); }}>Contact now</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Education Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="rounded-4 overflow-hidden position-relative" style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #fce8d5 50%, #e8f4f8 100%)', minHeight: '510px' }}>
                        <img
                            src={tryHeroImg('image 3.png')}
                            alt="Education"
                            className="position-absolute h-100"
                            style={{ objectFit: 'cover', top: 0, right: 0, width: '100%', borderRadius: '0 16px 16px 0' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />

                    </div>
                </div>
            </section>

            {/* Education Services Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fw-bold mb-0">Education Services</h2>
                            <p className="text-muted small mb-0">Expert guidance for your learning journey.</p>
                        </div>
                        <button onClick={() => handleViewAllServices('Education')} className="btn btn-link text-dark fw-semibold text-decoration-none p-0">See All &rarr;</button>
                    </div>

                    {/* 2x2 Dark Cards Grid */}
                    <div className="row g-3 mb-3">
                        {[
                            { badge: 'UP TO ₹400 OFF', badgeBg: '#2e7d32', title: 'Tutoring', desc: 'Academic Excellence.\nExpert.\nYour Sound.', img: 'tutoring.png' },
                            { badge: 'FREE DEMO', badgeBg: '#2e7d32', title: 'Language Training', desc: 'Master New Languages.\nFluency Guaranteed.', img: 'language.png' },
                            { badge: 'EXPERT COACHES', badgeBg: '#7c3aed', title: 'Music Lessons', desc: 'Learn Instruments.\nDiscover.\nYour Sound.', img: 'music.png' },
                            { badge: 'BEST SELLER', badgeBg: '#2e7d32', title: 'Skill Development', desc: 'Master New Crafts.\nCareer Ready.', img: 'skill.png' },
                        ].map((item, idx) => (
                            <div key={idx} className="col-6">
                                <div className="rounded-4 overflow-hidden position-relative" style={{ minHeight: '215px', background: '#222', cursor: 'pointer' }} onClick={() => handleCategoryClick('Education')}>
                                    <img src={tryHeroImg(item.img)} alt={item.title} className="position-absolute w-100 h-100" style={{ objectFit: 'cover', top: 0, left: 0, opacity: 0.55 }} onError={(e) => { e.target.style.display = 'none'; }} />
                                    <div className="position-relative p-3 d-flex flex-column justify-content-between" style={{ minHeight: '200px' }}>
                                        <div>
                                            <span className="fw-bold text-white px-2 py-1 rounded-2 mb-2 d-inline-block" style={{ background: item.badgeBg, fontSize: '9px', letterSpacing: '0.5px' }}>{item.badge}</span>
                                            <p className="text-white mb-1" style={{ fontSize: '10px', opacity: 0.7, letterSpacing: '1px' }}>ONE-APP</p>
                                            <h5 className="fw-bold text-white mb-1">{item.title}</h5>
                                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', lineHeight: 1.6 }}>
                                                {item.desc.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
                                            </p>
                                        </div>
                                        <button className="btn btn-light btn-sm fw-semibold rounded-3 px-3" style={{ width: 'fit-content' }} onClick={(e) => { e.stopPropagation(); handleCategoryClick('Education'); }}>Book Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust + Learning Lab Row */}
                    <div className="row g-3 mb-3">
                        <div className="col-lg-8">
                            <div className="rounded-4 border p-4" style={{ background: '#fff' }}>
                                <h6 className="fw-bold mb-2">Certified Professionals only.</h6>
                                <p className="text-muted small mb-5">Every educator on Oneapp Services or Partner Platform undergoes a rigorous 5-step background verification and skill assessment process before joining our elite network.</p>
                                <div className="d-flex gap-3">
                                    <span className="d-flex align-items-center gap-1" style={{ fontSize: '12px', color: '#2e7d32' }}><FaShieldAlt size={12} /> Identity Verified</span>
                                    <span className="d-flex align-items-center gap-1" style={{ fontSize: '12px', color: '#2e7d32' }}><FaGraduationCap size={12} /> Degree Verified</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="rounded-4 p-4 h-100 d-flex flex-column justify-content-between" style={{ background: '#1a1a1a' }}>
                                <div>
                                    <p className="text-white mb-1" style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '1px' }}>ONE-APP</p>
                                    <h6 className="fw-bold text-white mb-2">Learning Lab</h6>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Access our premium library of digital resources for all active students.</p>
                                </div>
                                <button className="btn btn-link text-white text-decoration-none p-0" style={{ fontSize: '13px', width: 'fit-content' }} onClick={() => handleCategoryClick('Education')}>Open Library &rarr;</button>
                            </div>
                        </div>
                    </div>

                    {/* Events & Media Banner */}
                    <div className="rounded-4 overflow-hidden position-relative" style={{ minHeight: '280px', background: '#111' }}>
                        <img src={tryHeroImg('events.png')} alt="Events & Media" className="position-absolute w-100 h-100" style={{ objectFit: 'cover', top: 0, left: 0, opacity: 0.55 }} onError={(e) => { e.target.style.display = 'none'; }} />
                        <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 45%, transparent 100%)' }} />
                        <div className="position-relative p-5 d-flex flex-column justify-content-center" style={{ minHeight: '280px', maxWidth: '420px' }}>
                            <span className="fw-bold text-white px-2 py-1 rounded-2 mb-3 d-inline-block" style={{ background: '#7c3aed', fontSize: '10px', width: 'fit-content' }}>UP TO ₹3,100 OFF</span>
                            <p className="text-white mb-1" style={{ fontSize: '10px', opacity: 0.7, letterSpacing: '1px' }}>ONE-APP</p>
                            <h3 className="fw-bold text-white mb-2">Events &amp; Media</h3>
                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', lineHeight: 1.7 }}>Professional solutions for every occasion. From intimate gatherings to grand celebrations, we bring your vision to life.</p>
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {['DJ Services', 'Photography', 'Catering', 'Videography', 'Event Planning'].map((tag, i) => (
                                    <span key={i} className="px-3 py-1 rounded-pill" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '11px' }}>{tag}</span>
                                ))}
                            </div>
                            <button className="btn btn-light fw-semibold rounded-3 px-4 py-2" style={{ width: 'fit-content' }} onClick={() => handleCategoryClick('Events & Media')}>Book Now &rarr;</button>
                        </div>
                        <div className="position-absolute" style={{ bottom: '20px', right: '30px' }}>
                            <span className="fw-bold text-white" style={{ fontSize: '11px', opacity: 0.4, letterSpacing: '3px' }}>EVENTS &amp; MEDIA SERVICES</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Expertise Services */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Our Expertise</h2>
                            <p className="text-muted small mb-0">Select a specialized service for your next event.</p>
                        </div>
                        <button onClick={() => handleViewAllServices('Expertise')} className="btn btn-link text-success fw-semibold text-decoration-none p-0" style={{ fontSize: '13px' }}>See all &rsaquo;</button>
                    </div>
                    <div className="row g-3">
                        {getCategoryServices('Expertise').map((service, idx) => (
                            <div key={idx} onClick={() => handleServiceClick(service._id)} className="col-lg-3 col-md-6" style={{ cursor: 'pointer' }}>
                                <div className="rounded-4 overflow-hidden mb-3 position-relative" style={{ height: '220px', background: '#f0f0f0' }}>
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.subcategory} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"><FaHeartbeat size={40} className="text-muted" /></div>
                                    )}
                                    {service.badge && (
                                        <span className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded-2 fw-semibold" style={{ background: '#fff', fontSize: '11px' }}>{service.badge}</span>
                                    )}
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                    <div className="fw-bold" style={{ fontSize: '15px' }}>{service.subcategory || service.name}</div>
                                    <div className="d-flex align-items-center gap-1">
                                        <FaStar style={{ color: '#f5a623', fontSize: '12px' }} />
                                        <span className="small fw-semibold">{service.ratingsAverage || 4.8}</span>
                                    </div>
                                </div>
                                <div className="text-muted small">Starts at ₹{service.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Social Impact Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row align-items-center g-0 border rounded-4 overflow-hidden">
                        <div className="col-lg-5">
                            <img
                                src={tryHeroImg('social-impact.png')}
                                alt="Our Social Impact"
                                className="w-100"
                                style={{ objectFit: 'cover', height: '380px' }}
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />

                        </div>
                        <div className="col-lg-7 p-5">
                            <h2 className="fw-bold mb-4" style={{ fontSize: '2.2rem' }}>Our social impact</h2>
                            <p className="text-muted mb-5" style={{ fontSize: '16px', lineHeight: 1.8 }}>
                                We believe deeply in driving social and economic progress across the region. We use our app to connect customers to the communities that need the most support.
                            </p>
                            <button className="btn fw-bold px-4 py-2 rounded-3" style={{ background: '#2e7d32', color: '#fff', fontSize: '15px' }}>
                                Read more
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stay Tuned / ONE APP Section */}
            <section
                className="py-5"
                style={{
                    background: "#f8f4ec",
                    overflow: "hidden",
                }}
            >
                <div className="container">
                    <div
                        className="position-relative d-flex justify-content-center align-items-start"
                        style={{ minHeight: "500px" }}
                    >
                        {/* Background ONE APP */}
                        <div
                            className="position-absolute w-100 text-center"
                            style={{
                                top: "120px",
                                left: 0,
                                zIndex: 1,
                                userSelect: "none",
                                lineHeight: 0.82,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "clamp(120px,22vw,260px)",
                                    fontWeight: 900,
                                    letterSpacing: "-8px",
                                    background:
                                        "linear-gradient(to bottom,#e6e6e6,#9c9c9c)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                ONE
                            </div>

                            <div
                                style={{
                                    fontSize: "clamp(120px,22vw,260px)",
                                    fontWeight: 900,
                                    letterSpacing: "-8px",
                                    background:
                                        "linear-gradient(to bottom,#e6e6e6,#9c9c9c)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                APP
                            </div>
                        </div>

                        {/* Black Card */}
                        <div
                            className="position-relative text-center px-5 py-5 rounded-4"
                            style={{
                                background: "#0d0d0d",
                                width: "100%",
                                maxWidth: "950px",
                                zIndex: 2,
                                boxShadow: "0 18px 35px rgba(0,0,0,.25)",
                            }}
                        >
                            <div
                                style={{
                                    color: "#fff",
                                    fontSize: "22px",
                                    opacity: 0.8,
                                    lineHeight: 1,
                                }}
                            >
                                ❝
                            </div>

                            <h2
                                className="mb-3"
                                style={{
                                    color: "#fff",
                                    fontFamily: "Georgia, serif",
                                    fontStyle: "italic",
                                    fontWeight: 400,
                                    fontSize: "clamp(28px,3vw,42px)",
                                }}
                            >
                                “Stay Tuned For More”
                            </h2>

                            <p
                                className="mb-1"
                                style={{
                                    color: "#d8d8d8",
                                    fontSize: "14px",
                                }}
                            >
                                We're continuously expanding our service networking to
                                deliver
                            </p>

                            <p
                                style={{
                                    color: "#67d36b",
                                    fontStyle: "italic",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    margin: 0,
                                }}
                            >
                                more value, more expertise and more possibilities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>




        </div>
    );
};

export default Home;