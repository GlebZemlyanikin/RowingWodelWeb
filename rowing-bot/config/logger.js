const winston = require('winston');
const path = require('path');

// Структурированное логирование с контекстом
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: {
        service: 'rowing-bot',
        environment: process.env.NODE_ENV || 'development',
    },
    transports: [
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

// В development режиме добавляем консольный вывод с цветами
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length
                        ? JSON.stringify(meta, null, 2)
                        : '';
                    return `${timestamp} [${level}]: ${message} ${metaStr}`;
                })
            ),
        })
    );
}

// Создаем директорию для логов если её нет
const fs = require('fs');
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Функция для логирования с контекстом
logger.logWithContext = function (level, message, context = {}) {
    this.log(level, message, {
        ...context,
        timestamp: new Date().toISOString(),
    });
};

module.exports = logger;

