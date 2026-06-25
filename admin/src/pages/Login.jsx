import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi';
import { FaLock, FaEnvelope, FaSignInAlt, FaTools } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await adminApi.login(email, password);
            if (res.success) {
                toast.success('Admin login successful!');
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="bg-dark text-light p-4 text-center border-bottom border-warning border-3">
                    <FaTools size={36} className="text-warning mb-2 animate-bounce" />
                    <h3 className="fw-bold mb-1 font-monospace">1App ADMIN</h3>
                    <p className="text-muted mb-0 small">Enter credentials to access administrative dashboard</p>
                </div>

                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold">Admin Email</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0"><FaEnvelope className="text-muted" /></span>
                                <input
                                    type="email"
                                    required
                                    className="form-control bg-light border-0 py-2.5"
                                    placeholder="admin@1App.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted small fw-bold">Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0"><FaLock className="text-muted" /></span>
                                <input
                                    type="password"
                                    required
                                    className="form-control bg-light border-0 py-2.5"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-warning btn-lg w-100 fw-bold py-2.5 d-flex align-items-center justify-content-center gap-2 shadow"
                        >
                            <FaSignInAlt />
                            <span>{loading ? 'Logging in...' : 'Enter Dashboard'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
