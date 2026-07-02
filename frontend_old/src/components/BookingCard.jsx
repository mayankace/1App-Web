import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaDownload, FaRupeeSign, FaTimesCircle, FaUserCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import bookingService from '../services/bookingService';

const BookingCard = ({ booking, onCancelSuccess }) => {
    const [cancelling, setCancelling] = useState(false);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Pending': return 'bg-warning text-dark';
            case 'Confirmed': return 'bg-info text-dark';
            case 'In Progress': return 'bg-primary text-light';
            case 'Completed': return 'bg-success text-light';
            case 'Cancelled': return 'bg-danger text-light';
            default: return 'bg-secondary text-light';
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        
        setCancelling(true);
        try {
            const res = await bookingService.cancelBooking(booking._id);
            if (res.success) {
                toast.success('Booking cancelled successfully!');
                if (onCancelSuccess) onCancelSuccess();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            const blob = await bookingService.downloadInvoice(booking._id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${booking._id}.txt`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            toast.error('Failed to download invoice');
        }
    };

    const serviceDateFormatted = new Date(booking.serviceDate).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const isCancellable = ['Pending', 'Confirmed'].includes(booking.status);

    return (
        <div className="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden">
            <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                    <span className="text-muted small">Booking ID:</span>{' '}
                    <span className="fw-mono text-dark fw-semibold">{booking._id}</span>
                </div>
                <span className={`badge ${getStatusBadgeClass(booking.status)} px-3 py-2 text-uppercase fs-8 fw-bold`}>
                    {booking.status}
                </span>
            </div>
            
            <div className="card-body p-4">
                <div className="row g-3 mb-4">
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        <div>
                            <div className="small text-muted">Service Date</div>
                            <div className="fw-semibold text-dark">{serviceDateFormatted}</div>
                        </div>
                    </div>
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                        <FaClock className="text-primary" />
                        <div>
                            <div className="small text-muted">Time Slot</div>
                            <div className="fw-semibold text-dark">{booking.timeSlot}</div>
                        </div>
                    </div>
                </div>

                <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Booked Services</h6>
                <div className="mb-4">
                    {booking.services.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="fw-semibold text-dark">{item.service?.name || 'Electrical Service'}</span>
                                <span className="text-muted ms-2">x{item.quantity}</span>
                            </div>
                            <div className="text-muted font-monospace">
                                ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                {booking.assignedTechnician?.name && (
                    <div className="alert alert-info border-0 rounded-3 d-flex align-items-center gap-3 p-3 mb-4">
                        <FaUserCheck className="fs-4 text-info" />
                        <div>
                            <div className="small text-muted fw-bold text-uppercase">Assigned Technician</div>
                            <div className="fw-semibold text-dark">{booking.assignedTechnician.name} ({booking.assignedTechnician.phone})</div>
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center border-top pt-4">
                    <div>
                        <div className="small text-muted">Total Amount Paid</div>
                        <div className="d-flex align-items-center text-dark fw-bold fs-4">
                            <FaRupeeSign className="fs-5" />
                            <span>{booking.totalAmount.toFixed(2)}</span>
                            <span className={`badge ms-2 fs-8 px-2 py-1 ${booking.paymentStatus === 'Paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                {booking.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        {isCancellable && (
                            <button 
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="btn btn-outline-danger d-flex align-items-center gap-2 px-3 py-2"
                            >
                                <FaTimesCircle />
                                <span>{cancelling ? 'Cancelling...' : 'Cancel'}</span>
                            </button>
                        )}
                        <button 
                            onClick={handleDownloadInvoice}
                            className="btn btn-outline-dark d-flex align-items-center gap-2 px-3 py-2"
                        >
                            <FaDownload />
                            <span>Invoice</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
