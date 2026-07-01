import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaCalendarAlt, FaClock, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { resolveImageUrl } from '../services/api';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
    const [serviceDate, setServiceDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const navigate = useNavigate();

    // Get today's date formatted as YYYY-MM-DD for standard min attribute
    const todayStr = new Date().toISOString().split('T')[0];

    const timeSlots = [
        '09:00 AM - 11:00 AM',
        '11:00 AM - 01:00 PM',
        '02:00 PM - 04:00 PM',
        '04:00 PM - 06:00 PM'
    ];

    const handleCheckout = () => {
        if (!serviceDate || !timeSlot) {
            toast.warn('Please select a service date and time slot first!');
            return;
        }

        // Store selected appointment details in sessionStorage to read in Checkout.jsx
        sessionStorage.setItem('vmarc_booking_date', serviceDate);
        sessionStorage.setItem('vmarc_booking_slot', timeSlot);
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="container py-5 text-center bg-white rounded-3 shadow-sm border my-5">
                <FaShoppingBag size={64} className="text-muted mb-3" />
                <h3 className="fw-bold text-dark">Your Cart is Empty</h3>
                <p className="text-muted">Add some 1App electrical services to get started.</p>
                <Link to="/services" className="btn btn-warning btn-lg fw-bold px-5 mt-3">
                    Explore Services
                </Link>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="fw-extrabold text-dark mb-4">Your Shopping Cart</h1>

            <div className="row g-4">
                {/* 1. Left Column: List of items */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                        <h5 className="fw-bold mb-4">Selected Services</h5>

                        {cartItems.map((item) => (
                            <div key={item.service._id} className="row g-3 align-items-center mb-4 pb-4 border-bottom last-border-none">
                                <div className="col-md-2 col-sm-3 text-center">
                                    <img
                                        src={resolveImageUrl(item.service.imageUrl) || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=150'}
                                        alt={item.service.name}
                                        className="rounded-3 img-fluid object-fit-cover"
                                        style={{ height: '70px', width: '70px' }}
                                    />
                                </div>

                                <div className="col-md-5 col-sm-9">
                                    <h6 className="fw-bold text-dark mb-1">{item.service.name}</h6>
                                    <span className="badge bg-light text-secondary border text-uppercase fs-9">{item.service.category?.name || item.service.category}</span>
                                </div>

                                <div className="col-md-3 col-6 d-flex align-items-center justify-content-md-center gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-secondary rounded-circle"
                                        style={{ width: '28px', height: '28px', padding: 0 }}
                                        onClick={() => updateQuantity(item.service._id, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span className="fw-bold font-monospace px-2">{item.quantity}</span>
                                    <button
                                        className="btn btn-sm btn-outline-secondary rounded-circle"
                                        style={{ width: '28px', height: '28px', padding: 0 }}
                                        onClick={() => updateQuantity(item.service._id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="col-md-2 col-6 text-end d-flex flex-md-column justify-content-between align-items-end h-100">
                                    <div className="fw-bold text-primary font-monospace fs-5">
                                        ₹{(item.service.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => {
                                            removeFromCart(item.service._id);
                                            toast.info(`${item.service.name} removed from cart`);
                                        }}
                                        className="btn btn-link text-danger p-0 mt-md-2 text-decoration-none"
                                        title="Remove item"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Right Column: Schedule & Checkout Sum */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                        <h5 className="fw-bold mb-4">Schedule Appointment</h5>

                        {/* Date selection */}
                        <div className="mb-4">
                            <label className="form-label d-flex align-items-center gap-2 text-muted fw-semibold small mb-2">
                                <FaCalendarAlt className="text-primary" />
                                <span>Select Service Date</span>
                            </label>
                            <input
                                type="date"
                                min={todayStr}
                                className="form-control bg-light border-0 py-2.5 fw-medium text-dark"
                                value={serviceDate}
                                onChange={(e) => setServiceDate(e.target.value)}
                            />
                        </div>

                        {/* Slot Selection */}
                        <div className="mb-4">
                            <label className="form-label d-flex align-items-center gap-2 text-muted fw-semibold small mb-2">
                                <FaClock className="text-primary" />
                                <span>Select Time Slot</span>
                            </label>
                            <select
                                className="form-select bg-light border-0 py-2.5 fw-medium text-dark"
                                value={timeSlot}
                                onChange={(e) => setTimeSlot(e.target.value)}
                            >
                                <option value="">-- Choose Slot --</option>
                                {timeSlots.map((slot, idx) => (
                                    <option key={idx} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                        <h5 className="fw-bold mb-4">Summary</h5>

                        <div className="d-flex justify-content-between mb-3 text-muted">
                            <span>Subtotal</span>
                            <span className="font-monospace">₹{getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4 pb-4 border-bottom text-muted">
                            <span>Service Taxes / Fees</span>
                            <span className="text-success font-monospace">FREE</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="fw-bold text-dark fs-5">Total</span>
                            <span className="fw-bold text-primary font-monospace fs-4">₹{getCartTotal().toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="btn btn-warning btn-lg w-100 fw-bold py-3 d-flex align-items-center justify-content-center gap-2 shadow"
                        >
                            <span>Proceed to Pay</span>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
