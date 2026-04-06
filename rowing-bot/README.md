# Rowing Model Telegram Bot

Telegram бот для расчета модельного времени в гребле.

## Структура проекта

Проект организован в модульную структуру:

```
rowing-bot/
├── config/              # Конфигурация
│   ├── logger.js       # Структурированное логирование
│   └── constants.js    # Константы приложения
├── handlers/           # Обработчики команд и сообщений
│   ├── commandHandlers.js  # Обработчики команд (/start, /web, /backup, /restore)
│   └── messageHandlers.js  # Обработчики сообщений пользователей
├── keyboards/          # Функции создания клавиатур
│   └── index.js
├── middleware/         # Middleware для валидации и rate limiting
│   ├── rateLimiter.js  # Rate limiting для защиты от спама
│   └── validator.js    # Валидация входных данных
├── services/           # Бизнес-логика
│   ├── sessionService.js  # Управление сессиями пользователей
│   ├── modelService.js    # Расчет модельного времени
│   └── monitoring.js      # Мониторинг и метрики (Prometheus)
├── tests/              # Unit-тесты
│   ├── utils.test.js
│   ├── middleware/
│   └── services/
├── index.js            # Главный файл приложения
└── package.json
```

## Установка

```bash
npm install
```

## Запуск

```bash
npm start
```

## Переменные окружения

Создайте файл `.env` со следующими переменными:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
PORT=3000
NODE_ENV=production
USE_WEBHOOK=false
WEBHOOK_URL=https://your-app.onrender.com/webhook
LOG_LEVEL=info
```

## Тестирование

Запуск тестов:
```bash
npm test
```

Запуск тестов в режиме watch:
```bash
npm run test:watch
```

Запуск тестов с покрытием:
```bash
npm run test:coverage
```

## Мониторинг

Бот экспортирует метрики Prometheus на endpoint `/metrics`:

- `rowing_bot_messages_total` - общее количество сообщений
- `rowing_bot_commands_total` - общее количество команд
- `rowing_bot_calculations_total` - общее количество расчетов
- `rowing_bot_calculation_duration_seconds` - длительность расчетов
- `rowing_bot_active_users` - количество активных пользователей
- `rowing_bot_active_sessions` - количество активных сессий
- `rowing_bot_rate_limit_hits_total` - количество срабатываний rate limit
- `rowing_bot_errors_total` - общее количество ошибок

## Логирование

Логи сохраняются в директории `logs/`:
- `error.log` - только ошибки
- `combined.log` - все логи

Логи структурированы в формате JSON с контекстом (chatId, username, и т.д.).

## Основные функции

1. **Расчет модельного времени** - расчет времени на основе мировой или российской модели
2. **Создание Excel файлов** - экспорт результатов в Excel
3. **Резервное копирование** - автоматическое создание резервных копий данных
4. **Rate limiting** - защита от спама (20 запросов в минуту)
5. **Валидация данных** - проверка всех входных данных

## Команды бота

- `/start` - начать новый расчет
- `/web` - получить ссылку на веб-версию калькулятора
- `/backup` - создать резервную копию данных (только для администраторов)
- `/restore` - восстановить данные из резервной копии (только для администраторов)

## Зависимости

- `node-telegram-bot-api` - работа с Telegram Bot API
- `express` - веб-сервер для webhook и метрик
- `winston` - структурированное логирование
- `prom-client` - метрики Prometheus
- `exceljs` - создание Excel файлов
- `dotenv` - управление переменными окружения

## Разработка

Проект использует модульную архитектуру для упрощения поддержки и тестирования:

- **handlers/** - обработка команд и сообщений
- **services/** - бизнес-логика (изолирована от Telegram API)
- **middleware/** - валидация и rate limiting
- **keyboards/** - создание клавиатур

Каждый модуль может быть протестирован независимо.
