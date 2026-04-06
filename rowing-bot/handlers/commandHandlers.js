const logger = require('../config/logger');
const { getMessage, WEB_URL } = require('../config/constants');
const { createModelTypeKeyboard } = require('../keyboards');
const { safeSendMessage } = require('./messageHandlers');
const { recordCommand } = require('../services/monitoring');
const {
    initUserState,
    initUserSession,
    logUserAction,
} = require('../services/sessionService');
const {
    createBackup,
    restoreFromBackup,
    BACKUP_DIR,
} = require('../backup');
const fs = require('fs');

async function handleStart(bot, msg) {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    logger.logWithContext('info', 'User started bot', {
        chatId,
        username,
        userId: msg.from.id,
    });

    recordCommand('start');

    initUserState(chatId);
    initUserSession(chatId, username);
    logUserAction(chatId, 'start_bot');

    const keyboard = createModelTypeKeyboard(chatId);
    await safeSendMessage(bot, chatId, getMessage(chatId, 'selectModel'), keyboard);

    // Inline web button as a separate message
    await safeSendMessage(bot, chatId, 'Открыть веб-калькулятор:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Открыть веб-калькулятор', url: WEB_URL }],
            ],
        },
    });
}

async function handleWeb(bot, msg) {
    const chatId = msg.chat.id;
    recordCommand('web');
    await safeSendMessage(bot, chatId, `Веб-версия калькулятора: ${WEB_URL}`);
}

async function handleBackup(bot, msg) {
    const chatId = msg.chat.id;
    const { userSessions, userStates, userSettings } = require('../services/sessionService');

    recordCommand('backup');

    try {
        await createBackup(userSessions, userStates, userSettings, logger);
        await safeSendMessage(bot, chatId, 'Резервная копия данных создана');
    } catch (error) {
        logger.logWithContext('warn', 'Could not create backup', {
            chatId,
            error: error.message,
        });
        await safeSendMessage(
            bot,
            chatId,
            'Резервная копия не создана (функция недоступна)'
        );
    }
}

async function handleRestore(bot, msg) {
    const chatId = msg.chat.id;
    const { userSessions, userStates, userSettings } = require('../services/sessionService');

    recordCommand('restore');

    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            await safeSendMessage(bot, chatId, 'Резервные копии недоступны');
            return;
        }

        const files = await fs.promises.readdir(BACKUP_DIR);
        if (files.length === 0) {
            await safeSendMessage(bot, chatId, 'Нет доступных резервных копий');
            return;
        }

        const sortedFiles = files.sort().reverse();
        const latestBackup = sortedFiles[0];

        const success = await restoreFromBackup(
            `${BACKUP_DIR}/${latestBackup}`,
            userSessions,
            userStates,
            userSettings,
            logger
        );
        if (success) {
            await safeSendMessage(
                bot,
                chatId,
                'Данные восстановлены из последней резервной копии'
            );
        } else {
            await safeSendMessage(bot, chatId, 'Ошибка при восстановлении данных');
        }
    } catch (error) {
        logger.logWithContext('warn', 'Could not restore from backup', {
            chatId,
            error: error.message,
        });
        await safeSendMessage(bot, chatId, 'Восстановление недоступно');
    }
}

module.exports = {
    handleStart,
    handleWeb,
    handleBackup,
    handleRestore,
};

