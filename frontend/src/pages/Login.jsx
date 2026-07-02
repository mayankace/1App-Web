import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaArrowRight, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
    const { login, register, isAuthenticated, loading } = useContext(AuthContext);
    const [isLoginView, setIsLoginView] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    // Redirect path if coming from checkout/cart
    const fromPath = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(fromPath, { replace: true });
        }
    }, [isAuthenticated, fromPath, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLoginView) {
                await login(email, password);
                toast.success('Logged in successfully!');
            } else {
                if (!name.trim() || !phone.trim()) {
                    toast.error('All registration fields are required!');
                    return;
                }
                await register({ name, email, phone, password });
                toast.success('Registered successfully! Welcome to 1App.');
            }
        } catch (err) {
            toast.error(err.message || 'Authentication failed');
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-white">
                        <div className="bg-dark text-light p-4 text-center border-bottom border-warning border-3">
                            <h3 className="fw-bold mb-1">1App PORTAL</h3>
                            <p className="text-muted mb-0 small">
                                {isLoginView ? 'Sign in to book and manage services' : 'Create an account to get started'}
                            </p>
                        </div>

                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {!isLoginView && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small fw-bold">Full Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaUser className="text-muted" /></span>
                                                <input
                                                    type="text"
                                                    required
                                                    className="form-control bg-light border-0 py-2"
                                                    placeholder="John Doe"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label text-muted small fw-bold">Phone Number</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaPhone className="text-muted" /></span>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="form-control bg-light border-0 py-2"
                                                    placeholder="+91 98765 43210"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><FaEnvelope className="text-muted" /></span>
                                        <input
                                            type="email"
                                            required
                                            className="form-control bg-light border-0 py-2"
                                            placeholder="name@example.com"
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
                                            className="form-control bg-light border-0 py-2"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-warning btn-lg w-100 fw-bold py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                                >
                                    {isLoginView ? (
                                        <>
                                            <FaSignInAlt />
                                            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaUserPlus />
                                            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                                        </>
                                    )}
                                    <FaArrowRight className="ms-1" size={14} />
                                </button>
                            </form>
                        </div>

                        <div className="card-footer bg-light py-3 border-0 text-center">
                            <button
                                onClick={() => setIsLoginView(!isLoginView)}
                                className="btn btn-link text-decoration-none text-muted small fw-semibold"
                            >
                                {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
