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
                name: 'Home Care',
                description: 'Deep bedroom cleaning including dusting, floor cleaning, bed-side area cleaning, visible stain removal, and surface sanitization.',
                price: 699,
                duration: 60,
                category: 'Cleaning',
                subcategory: 'Bedroom Cleaning',
                imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: 'Home Care',
                description: 'Toilet and bathroom cleaning with descaling, floor scrubbing, fixture cleaning, and odor-control sanitization.',
                price: 599,
                duration: 45,
                category: 'Cleaning',
                subcategory: 'Toilet Cleaning',
                imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: 'Home Care',
                description: 'Kitchen cleaning including countertop cleaning, sink cleaning, oil stain treatment, cabinet exterior cleaning, and floor cleaning.',
                price: 799,
                duration: 75,
                category: 'Cleaning',
                subcategory: 'Kitchen Cleaning',
                imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: 'Home Care',
                description: 'Sofa vacuuming and shampoo cleaning for dust, light stains, and fabric freshness.',
                price: 899,
                duration: 45,
                category: 'Cleaning',
                subcategory: 'Sofa Cleaning',
                imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: 'Home Care',
                description: 'Fan, switchboard, and minor wiring repair for common household electrical issues.',
                price: 499,
                duration: 60,
                category: 'Electrical',
                subcategory: 'Minor Electrical Repair',
                imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
                isActive: true
            },
            {
                name: 'Personal Care',
                description: 'Basic in-home haircut service with hygienic tools and cleanup after the appointment.',
                price: 399,
                duration: 40,
                category: 'Grooming',
                subcategory: 'Haircut',
                imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400',
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
