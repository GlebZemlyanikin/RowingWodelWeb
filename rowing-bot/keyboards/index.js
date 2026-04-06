const { getMessage, boatClasses } = require('../config/constants');

function getTranslatedKeyboard(chatId, items) {
    return {
        reply_markup: {
            keyboard: items.map((item) => [getMessage(chatId, item)]),
            one_time_keyboard: true,
        },
    };
}

function createModelTypeKeyboard(chatId) {
    return {
        reply_markup: {
            keyboard: [
                [getMessage(chatId, 'worldModel')],
                [getMessage(chatId, 'russiaModel')],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
        },
    };
}

function createModeKeyboard(chatId) {
    const keyboard = {
        reply_markup: {
            keyboard: [
                [getMessage(chatId, 'singleTime')],
                [getMessage(chatId, 'createFile')],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
        },
    };
    addMainMenuButton(chatId, keyboard);
    return keyboard;
}

function createNextActionKeyboard(chatId) {
    const keyboard = {
        reply_markup: {
            keyboard: [
                [getMessage(chatId, 'enterMoreTime')],
                [getMessage(chatId, 'newName')],
                [getMessage(chatId, 'finishAndGetExcel')],
                [getMessage(chatId, 'editLastTime')],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
        },
    };
    addMainMenuButton(chatId, keyboard);
    return keyboard;
}

function addMainMenuButton(chatId, keyboard) {
    keyboard.reply_markup.keyboard.push([getMessage(chatId, 'mainMenu')]);
    return keyboard;
}

module.exports = {
    getTranslatedKeyboard,
    createModelTypeKeyboard,
    createModeKeyboard,
    createNextActionKeyboard,
    addMainMenuButton,
};

