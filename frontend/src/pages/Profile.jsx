import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, updateProfile, sendOTP, verifyOTP, loading } = useContext(AuthContext);

    // Form inputs
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [updating, setUpdating] = useState(false);

    // OTP verification variables
    const [showOtpField, setShowOtpField] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            toast.error('Name and Phone number are required!');
            return;
        }

        setUpdating(true);
        try {
            await updateProfile({ name, phone, address });
            toast.success('Profile updated successfully!');
            setShowOtpField(false); // Reset in case phone changed
        } catch (err) {
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleRequestOtp = async () => {
        try {
            const res = await sendOTP();
            if (res.success) {
                setShowOtpField(true);
                toast.success('Verification OTP sent! Check console / logs.');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to trigger verification code');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otpCode.trim()) {
            toast.error('Please enter the 6-digit OTP code');
            return;
        }

        setVerifying(true);
        try {
            const res = await verifyOTP(otpCode);
            if (res.success) {
                toast.success('Phone verified successfully!');
                setShowOtpField(false);
                setOtpCode('');
            }
        } catch (err) {
            toast.error(err.message || 'Invalid verification code');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading profile..." />;
    }

    return (
        <div className="container">
            <h1 className="fw-extrabold text-dark mb-4">My Profile</h1>

            <div className="row g-4">
                {/* 1. Profile overview details */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-3 bg-white p-4 text-center">
                        <div className="d-inline-flex align-items-center justify-content-center bg-warning text-dark rounded-circle p-4 mb-3 mx-auto" style={{ width: '80px', height: '80px' }}>
                            <FaUser size={36} />
                        </div>
                        <h4 className="fw-bold mb-1">{user?.name}</h4>
                        <span className="badge bg-light text-secondary border text-uppercase mb-4">{user?.role}</span>
                        
                        <div className="text-start d-flex flex-column gap-3 pt-3 border-top w-100">
                            <div className="d-flex align-items-center gap-2 text-muted">
                                <FaEnvelope />
                                <span>{user?.email}</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between text-muted">
                                <div className="d-flex align-items-center gap-2">
                                    <FaPhone />
                                    <span>{user?.phone}</span>
                                </div>
                                {user?.isPhoneVerified ? (
                                    <span className="badge bg-success-subtle text-success d-flex align-items-center gap-1">
                                        <FaCheckCircle />
                                        <span>Verified</span>
                                    </span>
                                ) : (
                                    <span className="badge bg-warning-subtle text-warning d-flex align-items-center gap-1">
                                        <FaExclamationTriangle />
                                        <span>Unverified</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Phone Verification Block */}
                        {!user?.isPhoneVerified && (
                            <div className="mt-4 pt-3 border-top w-100">
                                {!showOtpField ? (
                                    <button 
                                        onClick={handleRequestOtp}
                                        className="btn btn-warning w-100 fw-bold py-2"
                                    >
                                        Verify Phone Number
                                    </button>
                                ) : (
                                    <form onSubmit={handleVerifyOtp} className="text-start bg-light p-3 rounded border">
                                        <label className="form-label small fw-bold text-muted mb-2">
                                            Enter 6-digit OTP (check server console):
                                        </label>
                                        <div className="d-flex gap-2">
                                            <input 
                                                type="text"
                                                maxLength="6"
                                                required
                                                className="form-control text-center font-monospace"
                                                placeholder="999999"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                            />
                                            <button 
                                                type="submit" 
                                                disabled={verifying}
                                                className="btn btn-dark fw-bold"
                                            >
                                                {verifying ? '...' : 'Verify'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Edit Profile Details */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                        <h5 className="fw-bold mb-4">Edit Personal Information</h5>
                        
                        <form onSubmit={handleSaveProfile}>
                            <div className="row g-3">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted fw-semibold small mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="form-control bg-light border-0 py-2.5"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted fw-semibold small mb-2">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        required
                                        className="form-control bg-light border-0 py-2.5"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label text-muted fw-semibold small mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <FaMapMarkerAlt />
                                            <span>Default Delivery Address</span>
                                        </div>
                                    </label>
                                    <textarea 
                                        rows="3"
                                        className="form-control bg-light border-0"
                                        placeholder="Add default home or office address details..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={updating}
                                className="btn btn-warning fw-bold px-4 py-2.5 mt-2"
                            >
                                {updating ? 'Saving changes...' : 'Save Settings'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
