import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaMapMarkerAlt, FaPhone, FaRupeeSign, FaCalendarAlt, FaClock, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fields
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [instructions, setInstructions] = useState('');

    // States
    const [submitting, setSubmitting] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [paymentOrder, setPaymentOrder] = useState(null);
    const [showGateway, setShowGateway] = useState(false);
    const [gatewayProcessing, setGatewayProcessing] = useState(false);

    // Retrieve schedule from sessionStorage
    const bookingDate = sessionStorage.getItem('vmarc_booking_date');
    const bookingSlot = sessionStorage.getItem('vmarc_booking_slot');

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }
        if (!bookingDate || !bookingSlot) {
            toast.warn('Please schedule your service date and slot first.');
            navigate('/cart');
            return;
        }
        // Pre-fill user data
        if (user) {
            setAddress(user.address || '');
            setPhone(user.phone || '');
        }
    }, [user, cartItems, bookingDate, bookingSlot, navigate]);

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        if (!address.trim() || !phone.trim()) {
            toast.error('Address and Contact phone number are required!');
            return;
        }

        setSubmitting(true);
        try {
            // Prepare payload
            const payload = {
                services: cartItems.map(item => ({
                    service: item.service._id,
                    quantity: item.quantity
                })),
                address,
                phone,
                serviceDate: bookingDate,
                timeSlot: bookingSlot,
                specialInstructions: instructions
            };

            const res = await bookingService.createBooking(payload);
            if (res.success) {
                setBookingDetails(res.data.booking);
                setPaymentOrder(res.data.paymentOrder);
                setShowGateway(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place booking order');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSimulatePayment = async (status) => {
        setGatewayProcessing(true);
        try {
            const payload = {
                bookingId: bookingDetails._id,
                razorpayOrderId: paymentOrder.id,
                razorpayPaymentId: status === 'success' ? `pay_mock_${Math.random().toString(36).substring(2, 10)}` : 'pay_failed',
                razorpaySignature: `sig_mock_${Math.random().toString(36).substring(2, 12)}`,
                status: status
            };

            const res = await bookingService.verifyPayment(payload);
            if (res.success) {
                toast.success('Payment completed & booking confirmed!');
                clearCart();
                sessionStorage.removeItem('vmarc_booking_date');
                sessionStorage.removeItem('vmarc_booking_slot');
                navigate('/bookings');
            } else {
                toast.error('Payment failed!');
                setShowGateway(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment simulation failed');
            setShowGateway(false);
        } finally {
            setGatewayProcessing(false);
        }
    };

    if (showGateway) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-white">
                            <div className="bg-dark text-light p-4 text-center border-bottom border-warning border-3">
                                <FaLock className="text-warning mb-2" size={32} />
                                <h4 className="fw-bold mb-0">vmarc SECURE PAY</h4>
                                <small className="text-muted">Simulated Payment Gateway</small>
                            </div>

                            <div className="card-body p-4 text-center">
                                <div className="mb-4">
                                    <span className="text-muted small d-block">Order ID</span>
                                    <span className="font-monospace text-dark fw-bold">{paymentOrder?.id}</span>
                                </div>

                                <div className="bg-light rounded-3 p-3 mb-4">
                                    <span className="text-muted d-block small">Amount to Pay</span>
                                    <h2 className="text-primary fw-extrabold font-monospace mb-0">
                                        ₹{getCartTotal().toFixed(2)}
                                    </h2>
                                </div>

                                {gatewayProcessing ? (
                                    <LoadingSpinner message="Processing your transaction securely..." />
                                ) : (
                                    <div className="d-flex flex-column gap-3 py-2">
                                        <button
                                            onClick={() => handleSimulatePayment('success')}
                                            className="btn btn-success btn-lg fw-bold py-3 d-flex align-items-center justify-content-center gap-2"
                                        >
                                            <FaCheckCircle />
                                            <span>Simulate Success (Pay ₹{getCartTotal()})</span>
                                        </button>
                                        <button
                                            onClick={() => handleSimulatePayment('failed')}
                                            className="btn btn-outline-danger btn-lg py-3 d-flex align-items-center justify-content-center gap-2"
                                        >
                                            <FaExclamationTriangle />
                                            <span>Simulate Payment Failure</span>
                                        </button>
                                        <button
                                            onClick={() => setShowGateway(false)}
                                            className="btn btn-link text-muted"
                                        >
                                            Cancel Transaction
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="fw-extrabold text-dark mb-4">Confirm Checkout</h1>

            {submitting ? (
                <LoadingSpinner message="Creating booking order..." />
            ) : (
                <div className="row g-4">
                    {/* Left Column: Form details */}
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                            <h5 className="fw-bold mb-4">Service Delivery Address & Contact</h5>

                            <form onSubmit={handleCreateOrder}>
                                <div className="mb-4">
                                    <label className="form-label d-flex align-items-center gap-2 text-muted fw-bold small mb-2">
                                        <FaMapMarkerAlt className="text-primary" />
                                        <span>Full Address (House No, Building, Street, City)</span>
                                    </label>
                                    <textarea
                                        rows="3"
                                        required
                                        className="form-control bg-light border-0"
                                        placeholder="Enter full address where service needs to be performed..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label d-flex align-items-center gap-2 text-muted fw-bold small mb-2">
                                        <FaPhone className="text-primary" />
                                        <span>Contact Phone Number</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        className="form-control bg-light border-0"
                                        placeholder="Enter contact number..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-muted fw-bold small mb-2">
                                        Special Instructions / Outlets notes (Optional)
                                    </label>
                                    <textarea
                                        rows="2"
                                        className="form-control bg-light border-0"
                                        placeholder="Any notes for technicians e.g. switchboard location, wire thickness needed, etc."
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-warning btn-lg w-100 fw-bold py-3 mt-2 shadow"
                                >
                                    Proceed to Secure Payment
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Appointment summary */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                            <h5 className="fw-bold mb-3">Booking Schedule</h5>
                            <div className="d-flex flex-column gap-2 mb-2">
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <FaCalendarAlt />
                                    <span>Date:</span>
                                    <strong className="text-dark">{new Date(bookingDate).toLocaleDateString()}</strong>
                                </div>
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <FaClock />
                                    <span>Slot:</span>
                                    <strong className="text-dark">{bookingSlot}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                            <h5 className="fw-bold mb-4">Cart Summary</h5>
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="d-flex justify-content-between mb-3 text-muted small">
                                    <span>{item.service.name} x{item.quantity}</span>
                                    <span className="font-monospace">₹{(item.service.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mb-0 mt-3">
                                <span className="fw-bold text-dark fs-5">Subtotal</span>
                                <span className="fw-bold text-primary font-monospace fs-4">₹{getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
