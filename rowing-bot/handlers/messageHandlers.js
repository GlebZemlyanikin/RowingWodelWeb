const logger = require('../config/logger');
const { getMessage, STATES, worldAgeCategories, russiaAgeCategories } = require('../config/constants');
const {
    createModelTypeKeyboard,
    createModeKeyboard,
    createNextActionKeyboard,
    getTranslatedKeyboard,
} = require('../keyboards');
const {
    validateText,
    validateName,
    validateTime,
    validateModelType,
    validateMode,
    validateAgeCategory,
    validateDistance,
    validateBoatClass,
    validateAction,
} = require('../middleware/validator');
const { checkRateLimit, recordRateLimitHit } = require('../middleware/rateLimiter');
const {
    getUserState,
    initUserState,
    saveResult,
    logUserAction,
    getUserSession,
    deleteUserSession,
} = require('../services/sessionService');
const { calculateModelTime, updateResultTime } = require('../services/modelService');
const { recordMessage, recordError, recordCalculation } = require('../services/monitoring');
const { distances } = require('../distanceTable');
const { boatClasses } = require('../config/constants');
const { createExcelFile } = require('../excel');
const fs = require('fs');

// Безопасная отправка сообщений с обработкой ошибок
async function safeSendMessage(bot, chatId, text, options = {}) {
    try {
        await bot.sendMessage(chatId, text, options);
        recordMessage('text', 'success');
    } catch (error) {
        logger.logWithContext('error', 'Error sending message', {
            chatId,
            error: error.message,
        });
        recordMessage('text', 'error');
        recordError('send_message');
        // Не пробрасываем ошибку дальше, чтобы не сломать бота
    }
}

async function handleMainMenu(bot, chatId) {
    const userState = getUserState(chatId);
    if (userState) {
        initUserState(chatId);
        const keyboard = createModelTypeKeyboard(chatId);
        await safeSendMessage(bot, chatId, 'Выберите тип модели:', keyboard);
    }
}

async function handleModelTypeSelection(bot, chatId, text, username) {
    const validation = validateModelType(chatId, text);
    if (!validation.valid) {
        await safeSendMessage(bot, chatId, validation.error);
        return;
    }

    const userState = getUserState(chatId);
    userState.modelType = validation.value;
    userState.state = STATES.WAITING_MODE;

    logger.logWithContext('info', 'User selected model type', {
        chatId,
        username,
        modelType: validation.value,
    });

    logUserAction(chatId, 'select_model_type', { modelType: validation.value });

    const keyboard = createModeKeyboard(chatId);
    await safeSendMessage(bot, chatId, getMessage(chatId, 'selectMode'), keyboard);
}

async function handleModeSelection(bot, chatId, text, username) {
    const userState = getUserState(chatId);
    const validation = validateMode(chatId, text);

    if (validation.isAgeCategory) {
        // Обработка случая, когда пользователь отправил возрастную категорию в режиме выбора режима
        logger.logWithContext('warn', 'User sent age category in WAITING_MODE state', {
            chatId,
            username,
            text,
        });
        userState.state = STATES.WAITING_AGE;
        const availableAgeCategories =
            userState.modelType === getMessage(chatId, 'worldModel')
                ? worldAgeCategories
                : russiaAgeCategories;
        const keyboard = getTranslatedKeyboard(chatId, availableAgeCategories);
        await safeSendMessage(bot, chatId, getMessage(chatId, 'selectAge'), keyboard);
        return;
    }

    if (!validation.valid) {
        const keyboard = createModeKeyboard(chatId);
        await safeSendMessage(bot, chatId, validation.error, keyboard);
        return;
    }

    userState.mode = validation.value;

    if (validation.value === getMessage(chatId, 'createFile')) {
        userState.state = STATES.WAITING_NAME;
        logger.logWithContext('info', 'User selected mode', {
            chatId,
            username,
            mode: validation.value,
        });
        logUserAction(chatId, 'select_mode', { mode: validation.value });
        await safeSendMessage(bot, chatId, getMessage(chatId, 'enterName'));
    } else if (validation.value === getMessage(chatId, 'singleTime')) {
        userState.state = STATES.WAITING_AGE;
        logger.logWithContext('info', 'User selected mode', {
            chatId,
            username,
            mode: validation.value,
        });
        logUserAction(chatId, 'select_mode', { mode: validation.value });

        const availableAgeCategories =
            userState.modelType === getMessage(chatId, 'worldModel')
                ? worldAgeCategories
                : russiaAgeCategories;
        const keyboard = getTranslatedKeyboard(chatId, availableAgeCategories);
        await safeSendMessage(bot, chatId, getMessage(chatId, 'selectAge'), keyboard);
    }
}

async function handleNameInput(bot, chatId, text, username) {
    const validation = validateName(text);
    if (!validation.valid) {
        await safeSendMessage(bot, chatId, validation.error);
        return;
    }

    const userState = getUserState(chatId);
    userState.name = validation.value;
    userState.state = STATES.WAITING_AGE;

    logger.logWithContext('info', 'User entered name', {
        chatId,
        username,
        name: validation.value,
    });
    logUserAction(chatId, 'enter_name', { name: validation.value });

    const availableAgeCategories =
        userState.modelType === getMessage(chatId, 'worldModel')
            ? worldAgeCategories
            : russiaAgeCategories;
    const keyboard = getTranslatedKeyboard(chatId, availableAgeCategories);
    await safeSendMessage(bot, chatId, getMessage(chatId, 'selectAge'), keyboard);
}

async function handleAgeSelection(bot, chatId, text, username) {
    const userState = getUserState(chatId);
    const validation = validateAgeCategory(chatId, text, userState.modelType);

    if (!validation.valid) {
        await safeSendMessage(bot, chatId, validation.error);
        return;
    }

    userState.ageCategory = validation.value;
    userState.state = STATES.WAITING_DISTANCE;

    logger.logWithContext('info', 'User selected age category', {
        chatId,
        username,
        category: validation.value,
    });
    logUserAction(chatId, 'select_age_category', { category: validation.value });

    const keyboard = getTranslatedKeyboard(chatId, distances);
    await safeSendMessage(bot, chatId, getMessage(chatId, 'selectDistance'), keyboard);
}

async function handleDistanceSelection(bot, chatId, text, username) {
    const validation = validateDistance(chatId, text);

    if (!validation.valid) {
        await safeSendMessage(bot, chatId, validation.error);
        return;
    }

    const userState = getUserState(chatId);
    userState.distance = validation.parsedDistance;
    userState.state = STATES.WAITING_BOAT;

    logger.logWithContext('info', 'User selected distance', {
        chatId,
        username,
        distance: validation.value,
        parsedDistance: validation.parsedDistance,
    });
    logUserAction(chatId, 'select_distance', {
        distance: validation.value,
        parsedDistance: validation.parsedDistance,
    });

    const keyboard = getTranslatedKeyboard(chatId, boatClasses);
    await safeSendMessage(bot, chatId, getMessage(chatId, 'selectBoat'), keyboard);
}

async function handleBoatSelection(bot, chatId, text, username) {
    const validation = validateBoatClass(chatId, text);

    if (!validation.valid) {
        await safeSendMessage(bot, chatId, validation.error);
        return;
    }

    const userState = getUserState(chatId);
    userState.boatClass = validation.value;
    userState.state = STATES.WAITING_TIME;

    logger.logWithContext('info', 'User selected boat class', {
        chatId,
        username,
        boat: validation.value,
    });
    logUserAction(chatId, 'select_boat', { boat: validation.value });

    await safeSendMessage(bot, chatId, getMessage(chatId, 'enterTime'));
}

async function handleTimeInput(bot, chatId, text, username) {
    const validation = validateTime(text);

    if (!validation.valid) {
        await safeSendMessage(bot, chatId, validation.error);
        return;
    }

    const userState = getUserState(chatId);
    const totalSeconds = validation.value;

    logger.logWithContext('info', 'User entered time', {
        chatId,
        username,
        time: text,
        seconds: totalSeconds,
    });
    logUserAction(chatId, 'enter_time', {
        time: text,
        seconds: totalSeconds,
    });

    try {
        const startTime = Date.now();
        const result = calculateModelTime(userState, totalSeconds, chatId);
        const duration = (Date.now() - startTime) / 1000;

        recordCalculation(userState.modelType, 'success', duration);

        const response = getMessage(chatId, 'timeResult')
            .replace('{time}', text)
            .replace('{percentage}', result.percentage);

        if (userState.mode === getMessage(chatId, 'createFile')) {
            try {
                await saveResult(chatId, {
                    name: userState.name,
                    distance: userState.distance,
                    boatClass: userState.boatClass,
                    ageCategory: userState.ageCategory,
                    time: totalSeconds,
                    modelTime: result.modelTime,
                    percentage: result.percentage,
                    modelType: userState.modelType,
                });

                await safeSendMessage(bot, chatId, response);

                userState.state = STATES.WAITING_NEXT_ACTION;
                const keyboard = createNextActionKeyboard(chatId);
                await safeSendMessage(bot, chatId, getMessage(chatId, 'selectAction'), keyboard);
            } catch (saveError) {
                logger.logWithContext('error', 'Error saving result', {
                    chatId,
                    error: saveError.message,
                });
                recordError('save_result');
                await safeSendMessage(bot, chatId, response);
                await safeSendMessage(
                    bot,
                    chatId,
                    'Результат показан, но не сохранен из-за технической ошибки. Попробуйте еще раз.'
                );

                initUserState(chatId);
                const keyboard = createModelTypeKeyboard(chatId);
                await safeSendMessage(bot, chatId, getMessage(chatId, 'selectModel'), keyboard);
            }
        } else {
            await safeSendMessage(bot, chatId, response);

            initUserState(chatId);
            const keyboard = createModelTypeKeyboard(chatId);
            await safeSendMessage(bot, chatId, getMessage(chatId, 'selectModel'), keyboard);
        }
    } catch (error) {
        logger.logWithContext('error', 'Error calculating model time', {
            chatId,
            username,
            error: error.message,
            stack: error.stack,
        });
        recordCalculation(userState.modelType, 'error');
        recordError('model_calculation');
        logUserAction(chatId, 'error', {
            type: 'model_calculation',
            error: error.message,
        });
        await safeSendMessage(bot, chatId, getMessage(chatId, 'modelError'));
    }
}

async function handleNextAction(bot, chatId, text, username) {
    const validation = validateAction(chatId, text);

    if (!validation.valid) {
        await safeSendMessage(bot, chatId, validation.error);
        return;
    }

    const userState = getUserState(chatId);
    const action = validation.value;

    if (action === getMessage(chatId, 'enterMoreTime')) {
        userState.state = STATES.WAITING_TIME;
        await safeSendMessage(
            bot,
            chatId,
            'Введите время в формате СС.сс или ММ:СС.сс (например, 45.55 или 7:45.55)'
        );
    } else if (action === getMessage(chatId, 'newName')) {
        const mode = userState.mode;
        const modelType = userState.modelType;
        deleteUserSession(chatId);
        initUserState(chatId);
        const newState = getUserState(chatId);
        newState.modelType = modelType;
        newState.mode = mode;
        newState.state = STATES.WAITING_NAME;
        await safeSendMessage(bot, chatId, 'Введите имя или фамилию:');
    } else if (action === getMessage(chatId, 'finishAndGetExcel')) {
        try {
            const currentSession = getUserSession(chatId);
            const files = await createExcelFile(chatId, currentSession, getMessage);
            if (files) {
                await bot.sendDocument(chatId, files.excelFile, {
                    filename: `results_${currentSession.username}_${currentSession.chatId}.xlsx`,
                    contentType:
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                await safeSendMessage(
                    bot,
                    chatId,
                    'Excel файл с результатами создан. Используйте /start для нового набора данных.'
                );
                await safeSendMessage(bot, chatId, 'Клавиатура скрыта', {
                    reply_markup: { remove_keyboard: true },
                });
                try {
                    fs.unlinkSync(files.excelFile);
                } catch (error) {
                    logger.logWithContext('error', 'Error deleting file', {
                        error: error.message,
                    });
                }
                deleteUserSession(chatId);
                initUserState(chatId);
            } else {
                await safeSendMessage(bot, chatId, getMessage(chatId, 'noDataForExcel'));
            }
        } catch (error) {
            logger.logWithContext('error', 'Error in finish command handler', {
                chatId,
                error: error.message,
                stack: error.stack,
            });
            recordError('excel_creation');
            await safeSendMessage(bot, chatId, getMessage(chatId, 'excelError'));
        }
    } else if (action === getMessage(chatId, 'editLastTime')) {
        const session = getUserSession(chatId);
        if (session && session.results.length > 0) {
            userState.state = STATES.EDITING_LAST_TIME;
            const lastResult = session.results[session.results.length - 1];
            await safeSendMessage(
                bot,
                chatId,
                `Текущее время: ${lastResult.time}\nВведите новое время:`
            );
        } else {
            await safeSendMessage(bot, chatId, getMessage(chatId, 'noResults'));
        }
    }
}

async function handleEditLastTime(bot, chatId, text, username) {
    const session = getUserSession(chatId);
    if (!session || session.results.length === 0) {
        await safeSendMessage(bot, chatId, getMessage(chatId, 'noResults'));
        return;
    }

    const validation = validateTime(text);
    if (!validation.valid) {
        await safeSendMessage(bot, chatId, validation.error);
        return;
    }

    const userState = getUserState(chatId);
    const lastResult = session.results[session.results.length - 1];
    const newTimeSeconds = validation.value;

    try {
        updateResultTime(session, lastResult, newTimeSeconds, chatId);
        await safeSendMessage(bot, chatId, getMessage(chatId, 'timeUpdated'));
        userState.state = STATES.WAITING_NEXT_ACTION;
        const keyboard = createNextActionKeyboard(chatId);
        await safeSendMessage(bot, chatId, 'Выберите действие:', keyboard);
    } catch (error) {
        logger.logWithContext('error', 'Error updating result time', {
            chatId,
            error: error.message,
        });
        recordError('update_result_time');
        await safeSendMessage(bot, chatId, getMessage(chatId, 'modelError'));
    }
}

module.exports = {
    safeSendMessage,
    handleMainMenu,
    handleModelTypeSelection,
    handleModeSelection,
    handleNameInput,
    handleAgeSelection,
    handleDistanceSelection,
    handleBoatSelection,
    handleTimeInput,
    handleNextAction,
    handleEditLastTime,
};

