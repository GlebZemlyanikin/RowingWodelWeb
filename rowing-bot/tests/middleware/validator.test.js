const {
    validateText,
    validateName,
    validateTime,
    validateModelType,
    validateMode,
    validateAgeCategory,
    validateDistance,
    validateBoatClass,
} = require('../../middleware/validator');

describe('Validator', () => {
    const chatId = 'testChatId';

    describe('validateText', () => {
        test('should validate valid text', () => {
            expect(validateText('valid text')).toEqual({ valid: true });
        });

        test('should reject invalid text', () => {
            expect(validateText(null)).toEqual({
                valid: false,
                error: 'Invalid text format',
            });
            expect(validateText('')).toEqual({
                valid: false,
                error: 'Text cannot be empty',
            });
            expect(validateText('   ')).toEqual({
                valid: false,
                error: 'Text cannot be empty',
            });
        });
    });

    describe('validateName', () => {
        test('should validate valid name', () => {
            const result = validateName('John Doe');
            expect(result.valid).toBe(true);
            expect(result.value).toBe('John Doe');
        });

        test('should reject empty name', () => {
            expect(validateName('')).toEqual({
                valid: false,
                error: 'Имя не может быть пустым',
            });
        });

        test('should reject too long name', () => {
            const longName = 'a'.repeat(101);
            expect(validateName(longName)).toEqual({
                valid: false,
                error: 'Имя слишком длинное (максимум 100 символов)',
            });
        });

        test('should trim whitespace', () => {
            const result = validateName('  John Doe  ');
            expect(result.valid).toBe(true);
            expect(result.value).toBe('John Doe');
        });
    });

    describe('validateTime', () => {
        test('should validate SS.ss format', () => {
            const result = validateTime('45.55');
            expect(result.valid).toBe(true);
            expect(result.value).toBeCloseTo(45.55, 2);
        });

        test('should validate MM:SS.ss format', () => {
            const result = validateTime('7:45.55');
            expect(result.valid).toBe(true);
            expect(result.value).toBeCloseTo(465.55, 2);
        });

        test('should reject invalid time', () => {
            expect(validateTime('invalid')).toEqual({
                valid: false,
                error: expect.any(String),
            });
        });
    });

    describe('validateModelType', () => {
        test('should validate world model', () => {
            const result = validateModelType(chatId, 'Мировая модель');
            expect(result.valid).toBe(true);
        });

        test('should validate russia model', () => {
            const result = validateModelType(chatId, 'Российская модель (Н.Н.)');
            expect(result.valid).toBe(true);
        });

        test('should reject invalid model type', () => {
            const result = validateModelType(chatId, 'Invalid model');
            expect(result.valid).toBe(false);
        });
    });

    describe('validateBoatClass', () => {
        test('should validate valid boat class', () => {
            const result = validateBoatClass(chatId, '1х');
            expect(result.valid).toBe(true);
            expect(result.value).toBe('1х');
        });

        test('should reject invalid boat class', () => {
            const result = validateBoatClass(chatId, 'Invalid boat');
            expect(result.valid).toBe(false);
        });
    });
});

