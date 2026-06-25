const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' }); // load from backend folder
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const User = require('../models/User');

const seedData = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/1App';
        console.log(`Connecting to database at ${uri}...`);
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB for seeding');

        // 1) Seed Admin User
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@1App.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (!existingAdmin) {
            await Admin.create({
                name: '1App Administrator',
                email: adminEmail,
                password: adminPassword, // Will be auto-hashed by mongoose pre-save hook
                permissions: ['all']
            });
            console.log(`✅ Default admin account created: ${adminEmail}`);
        } else {
            console.log(`ℹ️ Admin account already exists: ${adminEmail}`);
        }

        // Also create an admin user entry in User collection (for simple JWT validation fallback compatibility)
        const existingUserAdmin = await User.findOne({ email: adminEmail });
        if (!existingUserAdmin) {
            await User.create({
                name: '1App Administrator',
                email: adminEmail,
                password: adminPassword,
                phone: '+10000000000',
                role: 'admin',
                isPhoneVerified: true
            });
            console.log(`✅ Default User admin account created: ${adminEmail}`);
        }

        // 2) Seed Initial 1App Services
        const sampleServices = [
            {
                name: 'Full Home Wiring Safety Inspection',
                description: 'Comprehensive inspection of electrical wiring, circuit breakers, grounding systems, and outlets. Highly recommended for older structures to prevent hazards.',
                price: 1499,
                duration: 90,
                category: 'Safety & Testing',
                imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: '1App Premium Cable Laying (per meter)',
                description: 'Professional cable ducting and wiring installation using 1App fire-resistant low smoke (FRLS) wires. Price excludes materials.',
                price: 199,
                duration: 60,
                category: 'Wiring & Cabling',
                imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: 'Smart Distribution Board (DB) Installation',
                description: 'Upgrade your distribution board with high-quality MCBs, ELCBs, and phase selectors. Includes testing and safety certifications.',
                price: 2499,
                duration: 120,
                category: 'Installation',
                imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: 'AC Electrical Socket & Line Installation',
                description: 'Installation of a heavy-duty 16A power socket with dedicated wiring from the main distribution panel to secure appliance loads.',
                price: 799,
                duration: 45,
                category: 'Installation',
                imageUrl: 'https://images.unsplash.com/photo-1558224492-db896886cd53?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: 'Emergency Electrical Short Circuit Repair',
                description: 'Priority troubleshooting and repair services for sudden electrical outages, trips, short-circuits, and wire burnouts.',
                price: 1199,
                duration: 60,
                category: 'Repair & Troubleshooting',
                imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: 'Inverter & Battery Backup Installation',
                description: 'Complete setup of domestic backup power systems, including inverter mountings, battery terminal configurations, and power source loops.',
                price: 1899,
                duration: 120,
                category: 'Installation',
                imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=400',
                isActive: true
            }
        ];

        // Clear existing services and insert new ones
        await Service.deleteMany({});
        await Service.insertMany(sampleServices);
        console.log('✅ Services seeded successfully!');

        await mongoose.connection.close();
        console.log('🔌 Database connection closed cleanly');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed with error:', err.message);
        process.exit(1);
    }
};

seedData();
