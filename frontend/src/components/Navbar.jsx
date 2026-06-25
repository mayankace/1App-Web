import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaListAlt, FaSignOutAlt, FaTools } from 'react-icons/fa';

const NavigationBar = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const { getCartItemsCount } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-uppercase tracking-wider" to="/">
                    <FaTools className="text-warning" />
                    <span>1App</span>
                    <span className="badge bg-warning text-dark fs-8 font-monospace">Services</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#vmarcNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="vmarcNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link fw-semibold px-3 ${isActive ? 'text-warning' : ''}`} to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => `nav-link fw-semibold px-3 ${isActive ? 'text-warning' : ''}`} to="/services">Services</NavLink>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        <Link className="btn btn-outline-light position-relative d-flex align-items-center gap-2 px-3" to="/cart">
                            <FaShoppingCart />
                            <span>Cart</span>
                            {getCartItemsCount() > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {getCartItemsCount()}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="dropdown">
                                <button className="btn btn-warning dropdown-toggle d-flex align-items-center gap-2" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaUser />
                                    <span>{user?.name || 'My Account'}</span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userMenu">
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/profile">
                                            <FaUser className="text-muted" />
                                            <span>Profile</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/bookings">
                                            <FaListAlt className="text-muted" />
                                            <span>My Bookings</span>
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger" onClick={handleLogout}>
                                            <FaSignOutAlt />
                                            <span>Logout</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Link className="btn btn-warning fw-semibold px-4" to="/login">Login / Sign Up</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
