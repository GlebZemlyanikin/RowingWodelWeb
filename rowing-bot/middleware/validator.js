const { getMessage, worldAgeCategories, russiaAgeCategories, boatClasses } = require('../config/constants');
const { parseTimeToSeconds } = require('../utils');

// Валидация входных данных
function validateText(text) {
    if (typeof text !== 'string') {
        return { valid: false, error: 'Invalid text format' };
    }
    if (!text || text.trim().length === 0) {
        return { valid: false, error: 'Text cannot be empty' };
    }
    return { valid: true };
}

function validateName(name) {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length === 0) {
        return { valid: false, error: 'Имя не может быть пустым' };
    }
    if (trimmedName.length > 100) {
        return { valid: false, error: 'Имя слишком длинное (максимум 100 символов)' };
    }
    return { valid: true, value: trimmedName };
}

function validateTime(timeStr) {
    const totalSeconds = parseTimeToSeconds(timeStr);
    if (totalSeconds <= 0) {
        return {
            valid: false,
            error: getMessage(null, 'invalidTime'),
        };
    }
    return { valid: true, value: totalSeconds };
}

function validateModelType(chatId, text) {
    const worldModel = getMessage(chatId, 'worldModel');
    const russiaModel = getMessage(chatId, 'russiaModel');

    if (text === worldModel || text === russiaModel) {
        return { valid: true, value: text };
    }
    return { valid: false, error: getMessage(chatId, 'invalidModel') };
}

function validateMode(chatId, text) {
    const modeText = text.trim();
    const singleTime = getMessage(chatId, 'singleTime');
    const createFile = getMessage(chatId, 'createFile');

    // Проверка на возрастную категорию (для обратной совместимости)
    const allAgeCategories = [...worldAgeCategories, ...russiaAgeCategories];
    const isAgeCategory = allAgeCategories.some(
        (cat) => modeText.includes(cat) || getMessage(chatId, cat) === modeText
    );

    if (isAgeCategory) {
        return { valid: false, isAgeCategory: true };
    }

    if (
        modeText.includes('Создать файл') ||
        modeText.includes('Create results file') ||
        modeText.includes('createFile') ||
        modeText === createFile
    ) {
        return { valid: true, value: createFile };
    }

    if (
        modeText.includes('Ввести одно время') ||
        modeText.includes('Enter single time') ||
        modeText.includes('singleTime') ||
        modeText === singleTime
    ) {
        return { valid: true, value: singleTime };
    }

    return { valid: false, error: getMessage(chatId, 'invalidMode') };
}

function validateAgeCategory(chatId, text, modelType) {
    const ageText = text.trim();
    const ageCategories =
        modelType === getMessage(chatId, 'worldModel')
            ? worldAgeCategories
            : russiaAgeCategories;

    const selectedCategory = ageCategories.find(
        (cat) =>
            getMessage(chatId, cat) === ageText ||
            cat === ageText ||
            ageText.includes(cat)
    );

    if (selectedCategory) {
        return { valid: true, value: selectedCategory };
    }
    return { valid: false, error: getMessage(chatId, 'invalidAge') };
}

function validateDistance(chatId, text) {
    const { distances } = require('../distanceTable');
    const distanceText = text.trim();
    const selectedDistance = distances.find(
        (dist) =>
            getMessage(chatId, dist) === distanceText ||
            dist === distanceText
    );

    if (selectedDistance) {
        const { getDistance } = require('../distanceTable');
        const parsedDistance = getDistance(selectedDistance);
        return { valid: true, value: selectedDistance, parsedDistance };
    }
    return { valid: false, error: getMessage(chatId, 'invalidDistance') };
}

function validateBoatClass(chatId, text) {
    const boatText = text.trim();
    const selectedBoat = boatClasses.find(
        (boat) =>
            getMessage(chatId, boat) === boatText ||
            boat === boatText ||
            boatText.includes(boat)
    );

    if (selectedBoat) {
        return { valid: true, value: selectedBoat };
    }
    return { valid: false, error: getMessage(chatId, 'invalidBoat') };
}

function validateAction(chatId, text) {
    const actions = [
        getMessage(chatId, 'enterMoreTime'),
        getMessage(chatId, 'newName'),
        getMessage(chatId, 'finishAndGetExcel'),
        getMessage(chatId, 'editLastTime'),
    ];

    if (actions.includes(text)) {
        return { valid: true, value: text };
    }
    return { valid: false, error: getMessage(chatId, 'invalidAction') };
}

module.exports = {
    validateText,
    validateName,
    validateTime,
    validateModelType,
    validateMode,
    validateAgeCategory,
    validateDistance,
    validateBoatClass,
    validateAction,
};

