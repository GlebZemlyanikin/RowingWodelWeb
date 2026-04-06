require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Импорты модулей
const logger = require('./config/logger');
const { getMessage, STATES } = require('./config/constants');
const { checkRateLimit } = require('./middleware/rateLimiter');
const { validateText } = require('./middleware/validator');
const {
    initUserState,
    getUserState,
    userSessions,
    userStates,
    userSettings,
} = require('./services/sessionService');
const {
    recordMessage,
    recordError,
    updateActiveUsers,
    updateActiveSessions,
    metricsMiddleware,
} = require('./services/monitoring');
const {
    handleStart,
    handleWeb,
    handleBackup,
    handleRestore,
} = require('./handlers/commandHandlers');
const {
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
} = require('./handlers/messageHandlers');
const { createBackup, BACKUP_INTERVAL } = require('./backup');

logger.info('Starting bot initialization...');

// Создание Express приложения
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/', (req, res) => {
    logger.logWithContext('info', 'Health check endpoint called', {
        ip: req.ip,
    });
    res.send('Bot is running!');
});

// Метрики endpoint
app.get('/metrics', async (req, res) => {
    try {
        const { register } = require('./services/monitoring');
        const metrics = await register.metrics();
        res.set('Content-Type', register.contentType);
        res.end(metrics);
    } catch (error) {
        logger.logWithContext('error', 'Error generating metrics', {
            error: error.message,
        });
        res.status(500).end('Error generating metrics');
    }
});

// Webhook endpoint
app.post('/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    logger.logWithContext('info', 'Web server started', {
        port,
    });
});

// Создание директорий
const dirs = ['sessions', 'backups', 'logs'];
dirs.forEach((dir) => {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            logger.logWithContext('info', 'Directory created', { dir });
        }
    } catch (error) {
        logger.logWithContext('warn', 'Could not create directory', {
            dir,
            error: error.message,
        });
    }
});

// Проверка токена
if (!process.env.TELEGRAM_BOT_TOKEN) {
    logger.error('TELEGRAM_BOT_TOKEN is not set!');
    process.exit(1);
}

logger.info('Creating bot instance...');

// Управление polling
let isPolling = false;
let retryCount = 0;
const MAX_RETRIES = 5;
const BASE_DELAY = 1000;
const RESTART_DELAY = 2000;

async function startPolling() {
    if (isPolling) {
        logger.info('Polling is already running, skipping start');
        return;
    }

    try {
        isPolling = true;
        await bot.startPolling();
        logger.logWithContext('info', 'Polling started successfully', {
            retryCount,
        });
        retryCount = 0;
    } catch (error) {
        logger.logWithContext('error', 'Error starting polling', {
            error: error.message,
            stack: error.stack,
        });
        isPolling = false;
        throw error;
    }
}

async function stopPolling() {
    if (!isPolling) {
        logger.info('Polling is not running, skipping stop');
        return;
    }

    try {
        await bot.stopPolling();
        logger.logWithContext('info', 'Polling stopped successfully', {});
        isPolling = false;
    } catch (error) {
        logger.logWithContext('error', 'Error stopping polling', {
            error: error.message,
        });
        throw error;
    }
}

async function restartPolling() {
    try {
        await stopPolling();
        await new Promise((resolve) => setTimeout(resolve, RESTART_DELAY));
        await startPolling();
    } catch (error) {
        logger.logWithContext('error', 'Error during polling restart', {
            error: error.message,
        });
        throw error;
    }
}

// Создание бота
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: {
        interval: 300,
        autoStart: false,
        params: {
            timeout: 10,
        },
    },
});

// Обработка ошибок polling
bot.on('polling_error', async (error) => {
    if (error.code === 'ETELEGRAM' && error.response.statusCode === 409) {
        logger.logWithContext('warn', 'Polling conflict detected', {
            retryAttempt: retryCount + 1,
            maxRetries: MAX_RETRIES,
        });

        if (retryCount < MAX_RETRIES) {
            const delay = BASE_DELAY * Math.pow(2, retryCount);
            retryCount++;

            logger.logWithContext('info', 'Waiting before retry', {
                delay,
                retryCount,
            });

            try {
                await new Promise((resolve) => setTimeout(resolve, delay));
                await restartPolling();
            } catch (err) {
                logger.logWithContext('error', 'Error during polling restart', {
                    error: err.message,
                });
                if (retryCount >= MAX_RETRIES) {
                    logger.error('Max retry attempts reached. Stopping bot.');
                    process.exit(1);
                }
            }
        } else {
            logger.error('Max retry attempts reached. Stopping bot.');
            await stopPolling();
            process.exit(1);
        }
    } else {
        logger.logWithContext('error', 'Polling error', {
            error: error.message,
            code: error.code,
            stack: error.stack,
        });
        recordError('polling_error');
    }
});

bot.on('polling_success', () => {
    if (retryCount > 0) {
        logger.logWithContext('info', 'Polling recovered successfully', {
            retryCount,
        });
        retryCount = 0;
    }
});

async function initializeBot() {
    try {
        await stopPolling();
        await startPolling();
        logger.logWithContext('info', 'Bot initialized successfully', {});
    } catch (error) {
        logger.logWithContext('error', 'Failed to initialize bot', {
            error: error.message,
        });
        process.exit(1);
    }
}

// Инициализация бота (webhook или polling)
if (process.env.USE_WEBHOOK === 'true') {
    const webhookUrl =
        process.env.WEBHOOK_URL || `https://your-app.onrender.com/webhook`;
    bot.setWebHook(webhookUrl);
    logger.logWithContext('info', 'Webhook set', { webhookUrl });
} else {
    initializeBot();
}

logger.info('Bot instance created');

// Обработчики команд
bot.onText(/\/start/, async (msg) => {
    await handleStart(bot, msg);
});

bot.onText(/\/web/, async (msg) => {
    await handleWeb(bot, msg);
});

bot.onText(/\/backup/, async (msg) => {
    await handleBackup(bot, msg);
});

bot.onText(/\/restore/, async (msg) => {
    await handleRestore(bot, msg);
});

// Обработчик всех сообщений
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const username = msg.from.username || msg.from.first_name;

    // Проверка rate limit
    if (!checkRateLimit(chatId)) {
        logger.logWithContext('warn', 'Rate limit exceeded', {
            chatId,
            username,
        });
        const { recordRateLimitHit } = require('./services/monitoring');
        recordRateLimitHit(chatId);
        await safeSendMessage(
            bot,
            chatId,
            'Слишком много запросов. Пожалуйста, подождите немного.'
        );
        return;
    }

    // Валидация входных данных
    const textValidation = validateText(text);
    if (!textValidation.valid) {
        return;
    }

    // Пропускаем команды
    if (typeof text === 'string' && text.startsWith('/')) {
        return;
    }

    // Обработка главного меню
    if (text === getMessage(chatId, 'mainMenu')) {
        await handleMainMenu(bot, chatId);
        return;
    }

    logger.logWithContext('info', 'User sent message', {
        chatId,
        username,
        text,
    });

    // Инициализация состояния пользователя если его нет
    if (!userStates.has(chatId)) {
        initUserState(chatId);
    }

    const userState = getUserState(chatId);

    // Обновление метрик активных пользователей
    updateActiveUsers(userSessions.size);
    updateActiveSessions(userStates.size);

    // Обработка состояний
    switch (userState.state) {
        case STATES.WAITING_MODEL_TYPE:
            await handleModelTypeSelection(bot, chatId, text, username);
            break;

        case STATES.WAITING_MODE:
            await handleModeSelection(bot, chatId, text, username);
            break;

        case STATES.WAITING_NAME:
            await handleNameInput(bot, chatId, text, username);
            break;

        case STATES.WAITING_AGE:
            await handleAgeSelection(bot, chatId, text, username);
            break;

        case STATES.WAITING_DISTANCE:
            await handleDistanceSelection(bot, chatId, text, username);
            break;

        case STATES.WAITING_BOAT:
            await handleBoatSelection(bot, chatId, text, username);
            break;

        case STATES.WAITING_TIME:
            await handleTimeInput(bot, chatId, text, username);
            break;

        case STATES.WAITING_NEXT_ACTION:
            await handleNextAction(bot, chatId, text, username);
            break;

        case STATES.EDITING_LAST_TIME:
            await handleEditLastTime(bot, chatId, text, username);
            break;
    }
});

// Автоматическое резервное копирование
setInterval(() => {
    createBackup(userSessions, userStates, userSettings, logger);
}, BACKUP_INTERVAL);

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.logWithContext(
        'info',
        'SIGTERM received, shutting down gracefully',
        {}
    );
    await stopPolling();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.logWithContext(
        'info',
        'SIGINT received, shutting down gracefully',
        {}
    );
    await stopPolling();
    process.exit(0);
});
