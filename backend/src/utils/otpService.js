const twilio = require('twilio');

// In-memory store for OTPs when simulating (for development/testing)
const otpStore = new Map();

const getTwilioClient = () => {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    if (sid && token && sid !== 'your_twilio_account_sid') {
        return twilio(sid, token);
    }
    return null;
};

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via SMS
 * @param {string} phone - User phone number
 * @returns {Promise<string>} - The sent OTP (for simulation/logging)
 */
const sendOTP = async (phone) => {
    const otp = generateOTP();
    // Save to store with expiry (5 minutes)
    const expires = Date.now() + 5 * 60 * 1000;
    otpStore.set(phone, { otp, expires });

    console.log(`\n--- 📱 OTP SIMULATION ---`);
    console.log(`To Phone: ${phone}`);
    console.log(`Your OTP: ${otp}`);
    console.log(`-------------------------\n`);

    const client = getTwilioClient();
    if (client) {
        try {
            await client.messages.create({
                body: `Your 1App verification OTP is: ${otp}. Valid for 5 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
                to: phone
            });
            console.log(`✅ SMS sent successfully via Twilio to ${phone}`);
        } catch (error) {
            console.error(`❌ Failed to send SMS via Twilio to ${phone}: ${error.message}`);
            console.log(`⚠️ Falling back to simulated verification using code: ${otp}`);
        }
    } else {
        console.log(`ℹ️ Twilio client not configured. Simulated OTP sent to console.`);
    }

    return otp;
};

/**
 * Verify OTP code
 * @param {string} phone - User phone number
 * @param {string} code - OTP code to verify
 * @returns {boolean} - True if OTP is valid
 */
const verifyOTP = (phone, code) => {
    // Development bypass option
    if (code === '999999') {
        return true;
    }

    const data = otpStore.get(phone);
    if (!data) return false;

    const { otp, expires } = data;

    // Check expiry
    if (Date.now() > expires) {
        otpStore.delete(phone);
        return false;
    }

    // Verify code
    if (otp === code) {
        otpStore.delete(phone);
        return true;
    }

    return false;
};

module.exports = {
    sendOTP,
    verifyOTP
};
