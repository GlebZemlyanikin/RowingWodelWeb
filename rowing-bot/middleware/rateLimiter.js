// Rate limiting для защиты от спама
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 минута
const RATE_LIMIT_MAX_REQUESTS = 20; // максимум 20 запросов в минуту

function checkRateLimit(chatId) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(chatId) || [];
    const recentRequests = userRequests.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
    );

    if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    recentRequests.push(now);
    rateLimitMap.set(chatId, recentRequests);
    return true;
}

function resetRateLimit(chatId) {
    rateLimitMap.delete(chatId);
}

function getRateLimitStats(chatId) {
    const userRequests = rateLimitMap.get(chatId) || [];
    const now = Date.now();
    const recentRequests = userRequests.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
    );
    return {
        current: recentRequests.length,
        max: RATE_LIMIT_MAX_REQUESTS,
        window: RATE_LIMIT_WINDOW,
    };
}

module.exports = {
    checkRateLimit,
    resetRateLimit,
    getRateLimitStats,
    RATE_LIMIT_WINDOW,
    RATE_LIMIT_MAX_REQUESTS,
};

