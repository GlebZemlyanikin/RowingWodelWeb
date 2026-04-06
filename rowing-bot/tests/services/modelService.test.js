const { calculateModelTime } = require('../../services/modelService');
const { getMessage } = require('../../config/constants');

// Моки для зависимостей
jest.mock('../../modelTableWORLD');
jest.mock('../../modelTableRUSSIA');
jest.mock('../../utils');
jest.mock('../../config/logger', () => ({
    logWithContext: jest.fn(),
}));

describe('Model Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should calculate model time for world model', () => {
        const { getModelTime } = require('../../modelTableWORLD');
        const { calculateModelPercentage } = require('../../utils');

        getModelTime.mockReturnValue(500);
        calculateModelPercentage.mockReturnValue(125.5);

        const userState = {
            modelType: 'Мировая модель',
            ageCategory: 'Мужчина',
            distance: 2000,
            boatClass: '1х',
        };

        const chatId = 'testChatId';
        const userTime = 400;

        const result = calculateModelTime(userState, userTime, chatId);

        expect(result.modelTime).toBe(500);
        expect(result.percentage).toBe('125.50');
        expect(getModelTime).toHaveBeenCalledWith(
            'Мужчина',
            2000,
            '1х',
            400
        );
    });

    test('should handle errors gracefully', () => {
        const { getModelTime } = require('../../modelTableWORLD');
        getModelTime.mockImplementation(() => {
            throw new Error('Calculation error');
        });

        const userState = {
            modelType: 'Мировая модель',
            ageCategory: 'Мужчина',
            distance: 2000,
            boatClass: '1х',
        };

        const chatId = 'testChatId';
        const userTime = 400;

        expect(() => {
            calculateModelTime(userState, userTime, chatId);
        }).toThrow();
    });
});

