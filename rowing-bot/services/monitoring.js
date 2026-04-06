const client = require('prom-client');
const logger = require('../config/logger');

// Создаем регистр метрик
const register = new client.Registry();

// Собираем стандартные метрики Node.js
client.collectDefaultMetrics({
    register,
    prefix: 'rowing_bot_',
});

// Метрики для бота
const messageCounter = new client.Counter({
    name: 'rowing_bot_messages_total',
    help: 'Total number of messages received',
    labelNames: ['type', 'status'],
    registers: [register],
});

const commandCounter = new client.Counter({
    name: 'rowing_bot_commands_total',
    help: 'Total number of commands executed',
    labelNames: ['command'],
    registers: [register],
});

const calculationCounter = new client.Counter({
    name: 'rowing_bot_calculations_total',
    help: 'Total number of model time calculations',
    labelNames: ['model_type', 'status'],
    registers: [register],
});

const calculationDuration = new client.Histogram({
    name: 'rowing_bot_calculation_duration_seconds',
    help: 'Duration of model time calculations in seconds',
    labelNames: ['model_type'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
    registers: [register],
});

const activeUsersGauge = new client.Gauge({
    name: 'rowing_bot_active_users',
    help: 'Number of active users',
    registers: [register],
});

const activeSessionsGauge = new client.Gauge({
    name: 'rowing_bot_active_sessions',
    help: 'Number of active sessions',
    registers: [register],
});

const rateLimitHitsCounter = new client.Counter({
    name: 'rowing_bot_rate_limit_hits_total',
    help: 'Total number of rate limit hits',
    labelNames: ['chat_id'],
    registers: [register],
});

const errorCounter = new client.Counter({
    name: 'rowing_bot_errors_total',
    help: 'Total number of errors',
    labelNames: ['error_type'],
    registers: [register],
});

// Функции для обновления метрик
function recordMessage(type, status = 'success') {
    messageCounter.inc({ type, status });
}

function recordCommand(command) {
    commandCounter.inc({ command });
}

function recordCalculation(modelType, status = 'success', duration = null) {
    calculationCounter.inc({ model_type: modelType, status });
    if (duration !== null) {
        calculationDuration.observe({ model_type: modelType }, duration);
    }
}

function updateActiveUsers(count) {
    activeUsersGauge.set(count);
}

function updateActiveSessions(count) {
    activeSessionsGauge.set(count);
}

function recordRateLimitHit(chatId) {
    rateLimitHitsCounter.inc({ chat_id: chatId.toString() });
}

function recordError(errorType) {
    errorCounter.inc({ error_type: errorType });
}

// Middleware для Express для экспорта метрик
function metricsMiddleware(req, res, next) {
    if (req.path === '/metrics') {
        register.metrics().then((metrics) => {
            res.set('Content-Type', register.contentType);
            res.end(metrics);
        }).catch((error) => {
            logger.logWithContext('error', 'Error generating metrics', {
                error: error.message,
            });
            res.status(500).end('Error generating metrics');
        });
    } else {
        next();
    }
}

module.exports = {
    register,
    recordMessage,
    recordCommand,
    recordCalculation,
    updateActiveUsers,
    updateActiveSessions,
    recordRateLimitHit,
    recordError,
    metricsMiddleware,
};

