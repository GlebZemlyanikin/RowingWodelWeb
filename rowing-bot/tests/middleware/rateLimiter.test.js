const {
    checkRateLimit,
    resetRateLimit,
    getRateLimitStats,
    RATE_LIMIT_MAX_REQUESTS,
} = require('../../middleware/rateLimiter');

describe('Rate Limiter', () => {
    beforeEach(() => {
        // Очищаем rate limit перед каждым тестом
        resetRateLimit('testChatId');
    });

    test('should allow requests within limit', () => {
        const chatId = 'testChatId';
        for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
            expect(checkRateLimit(chatId)).toBe(true);
        }
    });

    test('should block requests exceeding limit', () => {
        const chatId = 'testChatId';
        // Исчерпываем лимит
        for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
            checkRateLimit(chatId);
        }
        // Следующий запрос должен быть заблокирован
        expect(checkRateLimit(chatId)).toBe(false);
    });

    test('should reset rate limit', () => {
        const chatId = 'testChatId';
        // Исчерпываем лимит
        for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
            checkRateLimit(chatId);
        }
        expect(checkRateLimit(chatId)).toBe(false);

        // Сбрасываем
        resetRateLimit(chatId);
        expect(checkRateLimit(chatId)).toBe(true);
    });

    test('should return correct stats', () => {
        const chatId = 'testChatId';
        checkRateLimit(chatId);
        checkRateLimit(chatId);

        const stats = getRateLimitStats(chatId);
        expect(stats.current).toBe(2);
        expect(stats.max).toBe(RATE_LIMIT_MAX_REQUESTS);
    });

    test('should handle different chat IDs independently', () => {
        const chatId1 = 'chat1';
        const chatId2 = 'chat2';

        // Исчерпываем лимит для первого чата
        for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
            checkRateLimit(chatId1);
        }

        // Второй чат должен работать нормально
        expect(checkRateLimit(chatId2)).toBe(true);
        expect(checkRateLimit(chatId1)).toBe(false);
    });
});

