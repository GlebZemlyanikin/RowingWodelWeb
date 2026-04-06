const {
    parseTimeToSeconds,
    formatTime,
    avg,
    calculateModelPercentage,
} = require('../utils');

describe('Utils functions', () => {
    describe('parseTimeToSeconds', () => {
        test('should parse SS.ss format', () => {
            expect(parseTimeToSeconds('45.55')).toBeCloseTo(45.55, 2);
            expect(parseTimeToSeconds('100.50')).toBeCloseTo(100.50, 2);
        });

        test('should parse MM:SS.ss format', () => {
            expect(parseTimeToSeconds('7:45.55')).toBeCloseTo(465.55, 2);
            expect(parseTimeToSeconds('1:30.00')).toBeCloseTo(90.0, 2);
        });

        test('should parse MM.SS.ss format', () => {
            expect(parseTimeToSeconds('7.45.55')).toBeCloseTo(465.55, 2);
            expect(parseTimeToSeconds('1.30.00')).toBeCloseTo(90.0, 2);
        });

        test('should return 0 for invalid input', () => {
            expect(parseTimeToSeconds('invalid')).toBe(0);
            expect(parseTimeToSeconds('')).toBe(0);
            expect(parseTimeToSeconds('abc.def')).toBe(0);
        });
    });

    describe('formatTime', () => {
        test('should format seconds to MM:SS.ss', () => {
            expect(formatTime(45.55)).toBe('0:45.55');
            expect(formatTime(465.55)).toBe('7:45.55');
            expect(formatTime(90.0)).toBe('1:30.00');
        });

        test('should handle zero seconds', () => {
            expect(formatTime(0)).toBe('0:00.00');
        });

        test('should handle error cases', () => {
            expect(formatTime(NaN)).toBe('0:00.00');
        });
    });

    describe('avg', () => {
        test('should calculate average', () => {
            expect(avg([1, 2, 3, 4, 5])).toBe(3);
            expect(avg([10, 20, 30])).toBe(20);
        });

        test('should return 0 for empty array', () => {
            expect(avg([])).toBe(0);
            expect(avg(null)).toBe(0);
            expect(avg(undefined)).toBe(0);
        });

        test('should handle single value', () => {
            expect(avg([5])).toBe(5);
        });
    });

    describe('calculateModelPercentage', () => {
        test('should calculate model percentage correctly', () => {
            // Если модель = 500 секунд на 2000м, скорость модели = 4 м/с
            // Если пользователь = 400 секунд на 2000м, скорость пользователя = 5 м/с
            // Процент = (5/4) * 100 = 125%
            const baseModelTime = 500; // секунд на 2000м
            const distance = 2000; // метры
            const userTime = 400; // секунд
            const percentage = calculateModelPercentage(baseModelTime, distance, userTime);
            expect(percentage).toBeCloseTo(125, 1);
        });

        test('should return 0 for invalid inputs', () => {
            expect(calculateModelPercentage(null, 2000, 400)).toBe(0);
            expect(calculateModelPercentage(500, null, 400)).toBe(0);
            expect(calculateModelPercentage(500, 2000, null)).toBe(0);
            expect(calculateModelPercentage(0, 2000, 400)).toBe(0);
        });

        test('should handle slower user time', () => {
            const baseModelTime = 500;
            const distance = 2000;
            const userTime = 600; // медленнее модели
            const percentage = calculateModelPercentage(baseModelTime, distance, userTime);
            expect(percentage).toBeLessThan(100);
        });
    });
});

