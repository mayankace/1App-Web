import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';
import heroImg from '../assets/login_image.png';

const inputStyle = { border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', background: 'transparent' };
const AuthPanel = () => (
    <div
        style={{
            background: '#f5ede0',
            backgroundImage: `url(${heroImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            height: '100%',
        }}
    />
);

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100vh', overflow: 'hidden' }}>
            {/* left: Auth Panel */}
            <AuthPanel />
            {/* right: Form */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 56px', background: '#fff', height: '100%', boxSizing: 'border-box', overflowY: 'auto' }}>
                <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                            <div style={{ 
                                width: 60, 
                                height: 60, 
                                borderRadius: '50%', 
                                background: '#1a1a1a', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                border: '3px solid #2d7a3a'
                            }}>
                                <FaUserShield size={28} color="#fff" />
                            </div>
                        </div>
                        <p style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a1a1a', marginBottom: 4, letterSpacing: 0.5 }}>
                            <span style={{ color: '#1a1a1a' }}>1APP</span> <span style={{ color: '#2d7a3a' }}>ADMIN</span>
                        </p>
                        <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Enter your credentials to access the dashboard</p>
                        <div style={{ width: 40, height: 3, background: '#2d7a3a', margin: '12px auto 0', borderRadius: 2 }} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Email field */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: 6, color: '#1a1a1a' }}>
                                Admin Email
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ccc', borderRadius: 8, padding: '10px 14px', gap: 10 }}>
                                <FaEnvelope color="#888" size={14} />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@vmarc.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: 6, color: '#1a1a1a' }}>
                                Password
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ccc', borderRadius: 8, padding: '10px 14px', gap: 10 }}>
                                <FaLock color="#888" size={14} />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#aaa', display: 'flex' }}
                                >
                                    {showPass ? <FaEye size={15} /> : <FaEyeSlash size={15} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{
                                width: '100%', 
                                background: '#1a1a1a', 
                                color: '#fff', 
                                border: 'none',
                                borderRadius: 8, 
                                padding: '13px', 
                                fontWeight: 700, 
                                fontSize: '1rem',
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: 8, 
                                marginTop: 20,
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#2d7a3a';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#1a1a1a';
                            }}
                        >
                            {loading ? 'Logging in...' : 'Enter Dashboard'} 
                            <span style={{ fontSize: '1.1rem' }}>→</span>
                        </button>
                    </form>

                    {/* Admin footer note */}
                    <div style={{ 
                        marginTop: 30, 
                        padding: '16px 20px', 
                        background: '#f8f9fa', 
                        borderRadius: 8,
                        border: '1px solid #e9ecef',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6c757d' }}>
                            <span style={{ fontWeight: 700, color: '#1a1a1a' }}>🔒 Secure Admin Access</span>
                            <br />
                            This area is restricted to authorized personnel only
                        </p>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.88rem', color: '#555' }}>
                        <span style={{ color: '#888' }}>Return to</span>{' '}
                        <a href="/login" style={{ color: '#2d7a3a', fontWeight: 700, textDecoration: 'none' }}>User Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;