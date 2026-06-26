import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi';
import {
    FaLayout, FaChartBar, FaTasks, FaWrench, FaFolderOpen,
    FaUsers, FaTag, FaSignOutAlt, FaTools, FaPlus,
    FaList, FaLayerGroup
} from 'react-icons/fa';

const MainLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        adminApi.logout();
        navigate('/login');
    };

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <aside className="bg-dark text-light border-end" style={{ width: '260px', flexShrink: 0 }}>
                <div className="p-4 border-bottom d-flex align-items-center gap-2">
                    <FaTools className="text-dark" size={24} />
                    <div>
                        <h5 className="fw-bold mb-0 text-white font-monospace">1App</h5>
                        <small className="text-muted tracking-wider text-uppercase font-monospace fs-8">Admin Control</small>
                    </div>
                </div>

                <div className="p-3">
                    <ul className="nav nav-pills flex-column gap-2">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2.5 px-3 fw-medium text-light ${isActive ? 'bg-dark text-dark fw-bold shadow-sm' : 'hover-bg-muted'}`}
                            >
                                <FaChartBar />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/bookings"
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2.5 px-3 fw-medium text-light ${isActive ? 'bg-dark text-dark fw-bold shadow-sm' : 'hover-bg-muted'}`}
                            >
                                <FaTasks />
                                <span>Bookings</span>
                            </NavLink>
                        </li>

                        {/* Service Management Section */}
                        <li className="nav-item mt-2">
                            <div className="text-muted small text-uppercase px-3 mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                Service Management
                            </div>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/services"
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2.5 px-3 fw-medium text-light ${isActive ? 'bg-dark text-dark fw-bold shadow-sm' : 'hover-bg-muted'}`}
                            >
                                <FaWrench />
                                <span>Services</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/categories"
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2.5 px-3 fw-medium text-light ${isActive ? 'bg-dark text-dark fw-bold shadow-sm' : 'hover-bg-muted'}`}
                            >
                                <FaFolderOpen />
                                <span>Categories</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/subcategories"
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2.5 px-3 fw-medium text-light ${isActive ? 'bg-dark text-dark fw-bold shadow-sm' : 'hover-bg-muted'}`}
                            >
                                <FaLayerGroup />
                                <span>Subcategories</span>
                            </NavLink>
                        </li>

                        <li className="nav-item mt-2">
                            <div className="text-muted small text-uppercase px-3 mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                Management
                            </div>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/users"
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2.5 px-3 fw-medium text-light ${isActive ? 'bg-dark text-dark fw-bold shadow-sm' : 'hover-bg-muted'}`}
                            >
                                <FaUsers />
                                <span>Users</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/offers"
                                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2.5 px-3 fw-medium text-light ${isActive ? 'bg-dark text-dark fw-bold shadow-sm' : 'hover-bg-muted'}`}
                            >
                                <FaTag />
                                <span>Offers & Coupons</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="mt-auto p-3 border-top w-100 position-absolute bottom-0" style={{ maxWidth: '260px' }}>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                {/* Topbar Header */}
                <header className="bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-dark mb-0">System Control Center</h5>
                    <div className="d-flex align-items-center gap-2">
                        <span className="dot bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                        <span className="text-muted small fw-medium">Active Server Connection</span>
                    </div>
                </header>

                {/* Nested Routes Render */}
                <main className="p-4 flex-grow-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;