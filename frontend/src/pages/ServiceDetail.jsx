import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import serviceService from '../services/serviceService';
import LoadingSpinner from '../components/LoadingSpinner';
import { CartContext } from '../context/CartContext';
import { FaClock, FaRupeeSign, FaShoppingCart, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ServiceDetail = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await serviceService.getServiceById(id);
                if (res.success) {
                    setService(res.data.service);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleQuantityChange = (val) => {
        if (quantity + val < 1) return;
        setQuantity(quantity + val);
    };

    const handleAddToCart = () => {
        addToCart(service, quantity);
        toast.success(`${quantity} x ${service.name} added to cart!`);
    };

    if (loading) {
        return <LoadingSpinner message="Fetching service details..." />;
    }

    if (!service) {
        return (
            <div className="container py-5 text-center">
                <h3>Service not found</h3>
                <Link to="/services" className="btn btn-warning mt-3">Back to Services</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <Link to="/services" className="btn btn-light d-inline-flex align-items-center gap-2 mb-4">
                <FaArrowLeft />
                <span>Back to Services</span>
            </Link>

            <div className="row g-5">
                {/* Image Section */}
                <div className="col-lg-6">
                    <div className="rounded-4 overflow-hidden shadow-sm" style={{ maxHeight: '400px' }}>
                        <img
                            src={service.imageUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800'}
                            alt={service.name}
                            className="w-100 h-100 object-fit-cover"
                            style={{ minHeight: '350px' }}
                        />
                    </div>
                </div>

                {/* Service Details Section */}
                <div className="col-lg-6">
                    <div className="d-flex flex-column h-100">
                        <span className="badge bg-warning text-dark text-uppercase px-3 py-2 fs-8 fw-bold mb-3 align-self-start">
                            {service.category}
                        </span>
                        <h1 className="fw-extrabold text-dark mb-3">{service.name}</h1>

                        <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                            <div className="d-flex align-items-center gap-1 text-primary fw-bold fs-3">
                                <FaRupeeSign className="fs-5" />
                                <span>{service.price}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 text-muted fw-semibold">
                                <FaClock />
                                <span>{service.duration} mins estimated duration</span>
                            </div>
                        </div>

                        <p className="text-muted fs-5 mb-4" style={{ lineHeight: '1.7' }}>
                            {service.description}
                        </p>

                        {/* Order Quantity / Action Block */}
                        <div className="bg-white p-4 rounded-3 shadow-sm border mb-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <span className="fw-bold text-dark fs-5">Set Quantity</span>
                                <div className="d-flex align-items-center gap-3">
                                    <button
                                        className="btn btn-outline-secondary rounded-circle"
                                        style={{ width: '40px', height: '40px', padding: 0 }}
                                        onClick={() => handleQuantityChange(-1)}
                                    >
                                        -
                                    </button>
                                    <span className="fs-5 fw-bold font-monospace px-2">{quantity}</span>
                                    <button
                                        className="btn btn-outline-secondary rounded-circle"
                                        style={{ width: '40px', height: '40px', padding: 0 }}
                                        onClick={() => handleQuantityChange(1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn btn-warning btn-lg w-100 fw-bold py-3 d-flex align-items-center justify-content-center gap-2 shadow"
                            >
                                <FaShoppingCart />
                                <span>Add to Cart - Total: ₹{service.price * quantity}</span>
                            </button>
                        </div>

                        {/* Safety Standards Warning */}
                        <div className="alert alert-light border d-flex gap-3 p-3 rounded-3">
                            <FaShieldAlt className="text-success fs-3 mt-1" />
                            <div>
                                <h6 className="fw-bold text-success mb-1">1App Quality Standards</h6>
                                <p className="text-muted small mb-0">
                                    Our technicians use professional tools and only install ISI certified cables. Pre-checks and circuit insulation testing are included free with every order.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
