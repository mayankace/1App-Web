/**
 * Simple slots controller returning mock availability.
 */
exports.getAvailableSlots = async (req, res, next) => {
    try {
        const now = new Date();
        const dates = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() + i);
            dates.push({ date: d.toISOString(), times: ['04:30 PM','05:00 PM','05:30 PM','06:00 PM'] });
        }

        res.status(200).json({
            success: true,
            data: {
                instant: { etaMinutes: 50 },
                dates
            }
        });
    } catch (err) {
        next(err);
    }
};
