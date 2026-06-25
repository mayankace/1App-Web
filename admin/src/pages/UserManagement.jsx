import React, { useEffect, useState } from 'react';
import adminApi from '../services/adminApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaUser, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await adminApi.getUsers();
                if (res.success) {
                    setUsers(res.data.users);
                }
            } catch (err) {
                toast.error('Failed to load users list');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <div className="mb-4">
                <h1 className="fw-extrabold text-dark mb-1">Customer Accounts</h1>
                <p className="text-muted">Review customer directories, contact numbers, and verification flags.</p>
            </div>

            <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                {loading ? (
                    <LoadingSpinner message="Querying customer database..." />
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light border-0">
                                <tr>
                                    <th>Customer ID</th>
                                    <th>Name</th>
                                    <th>Email / Phone</th>
                                    <th>Phone Status</th>
                                    <th>Registered Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="font-monospace text-muted" style={{ fontSize: '0.8rem' }}>{user._id}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-warning-subtle text-warning rounded-circle p-2 d-inline-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                                    <FaUser size={14} />
                                                </div>
                                                <span className="fw-bold text-dark">{user.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-dark small">{user.email}</div>
                                            <small className="text-muted font-monospace">{user.phone}</small>
                                        </td>
                                        <td>
                                            {user.isPhoneVerified ? (
                                                <span className="badge bg-success-subtle text-success d-flex align-items-center gap-1 py-1 px-2.5" style={{ width: 'fit-content', fontSize: '0.75rem' }}>
                                                    <FaCheckCircle />
                                                    <span>Verified</span>
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning-subtle text-warning d-flex align-items-center gap-1 py-1 px-2.5" style={{ width: 'fit-content', fontSize: '0.75rem' }}>
                                                    <FaExclamationTriangle />
                                                    <span>Unverified</span>
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <small className="text-muted">{new Date(user.createdAt).toLocaleDateString()}</small>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">No registered customer users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
