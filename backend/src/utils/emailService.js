const winston = require('winston');

// Simplelogger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

/**
 * Send an email notification (Simulated)
 * @param {object} options - Email options { to, subject, html, text }
 */
const sendEmail = async (options) => {
    logger.info(`\n--- 📧 EMAIL SIMULATION ---`);
    logger.info(`To: ${options.to}`);
    logger.info(`Subject: ${options.subject}`);
    logger.info(`Content Summary: ${options.text || 'HTML Content'}`);
    logger.info(`---------------------------\n`);
    
    // Simulate async network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
        success: true,
        messageId: `simulated_msg_${Math.random().toString(36).substring(7)}`
    };
};

module.exports = {
    sendEmail
};
