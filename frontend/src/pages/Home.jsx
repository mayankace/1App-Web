import React, { useEffect, useState } from 'react';
import serviceService from '../services/serviceService';
import LoadingSpinner from '../components/LoadingSpinner';

// New Components
import HeroSection from '../components/home/HeroSection';
import TrustBanner from '../components/home/TrustBanner';
import HorizontalServiceScroller from '../components/home/HorizontalServiceScroller';
import PromoBanner from '../components/home/PromoBanner';
import CategorySEOFooter from '../components/home/CategorySEOFooter';

const Home = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const servicesRes = await serviceService.getAllServices();
                if (servicesRes.success) {
                    setServices(servicesRes.data.services);
                }
                const categoriesRes = await serviceService.getCategories();
                if (categoriesRes.success) {
                    setCategories(categoriesRes.data.categories);
                }
            } catch (err) {
                console.error('Error fetching home page data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Loading home page..." />;
    }

    return (
        <div>
            {/* 1. Hero Section */}
            <HeroSection services={services} />

            {/* 2. Trust Banner */}
            <TrustBanner />

            {/* 3. Horizontal Scroll: Most Booked (Just showing first 10 for demo) */}
            <HorizontalServiceScroller 
                title="Most booked services" 
                services={services.slice(0, 10)} 
            />

            {/* 4. Promo Banner 1 */}
            <PromoBanner 
                title="Wall Panels" 
                subtitle="Transform your living space" 
                bgImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=400&fit=crop"
                btnText="Explore Now"
                darkText={true}
            />

            {/* 5. Horizontal Scroll: specific subcategory if exists, else slice */}
            <HorizontalServiceScroller 
                title="Cleaning Services" 
                services={services.filter(s => s.subcategory?.toLowerCase().includes('clean')).slice(0, 10)} 
            />
            
            {/* Fallback if no cleaning services exist in DB yet */}
            {services.filter(s => s.subcategory?.toLowerCase().includes('clean')).length === 0 && (
                <HorizontalServiceScroller 
                    title="Home Repair Services" 
                    services={services.slice(2, 8)} 
                />
            )}

            {/* 6. Promo Banner 2 */}
            <PromoBanner 
                title="Smart Locks" 
                subtitle="Secure your home with modern tech" 
                bgImage="https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=400&fit=crop"
                btnText="Buy & Install"
            />

            {/* 7. SEO Footer */}
            <CategorySEOFooter categories={categories} />
        </div>
    );
};

export default Home;