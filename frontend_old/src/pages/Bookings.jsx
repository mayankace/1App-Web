import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaListAlt } from 'react-icons/fa';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await bookingService.getMyBookings();
            if (res.success) {
                setBookings(res.data.bookings);
            }
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-extrabold text-dark mb-0">My Bookings</h1>
                <span className="badge bg-secondary px-3 py-2 fw-semibold font-monospace">
                    {bookings.length} Bookings
                </span>
            </div>

            {loading ? (
                <LoadingSpinner message="Fetching your service history..." />
            ) : (
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <BookingCard 
                                    key={booking._id} 
                                    booking={booking} 
                                    onCancelSuccess={fetchBookings} 
                                />
                            ))
                        ) : (
                            <div className="text-center py-5 bg-white rounded-3 shadow-sm border p-4 my-4">
                                <FaListAlt className="text-muted mb-3" size={48} />
                                <h4 className="fw-bold text-dark">No Bookings Found</h4>
                                <p className="text-muted">You haven't booked any electrical services yet.</p>
                                <Link to="/services" className="btn btn-warning fw-bold px-4 mt-2">
                                    Book a Service Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
