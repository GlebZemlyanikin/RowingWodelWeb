# Rowing Model Calculator

Веб-приложение для расчёта модельного времени и анализа результатов спортсменов по академической гребле.

## Статус и демо

- **CI (сборка и линт)**: ![CI](https://github.com/GlebZemlyanikin/RowingWodelWeb/actions/workflows/ci.yml/badge.svg)
- **Deploy (GitHub Pages)**: ![Deploy to GitHub Pages](https://github.com/GlebZemlyanikin/RowingWodelWeb/actions/workflows/deploy-pages.yml/badge.svg)
- **Приложение (prod)**: `https://glebzemlyanikin.github.io/RowingWodelWeb/`

## Возможности
- Расчёт модельного времени по российской и мировой модели
- Поддержка разных возрастных категорий и классов лодок
- Ввод и анализ нескольких спортсменов и отрезков
- Экспорт результатов в Excel
- Светлая и тёмная тема

## Быстрый старт

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите приложение в режиме разработки:
   ```bash
   npm run dev
   ```
3. Откройте в браузере: [http://localhost:5173](http://localhost:5173)

## Сборка для продакшена
```bash
npm run build
```

## Как устроен релиз (CI/CD)

- **PR или push** → GitHub Actions запускает **CI**: `npm ci` → `npm run lint` → `npm run build`.
- **Merge в `main`** → GitHub Actions собирает проект и **деплоит на GitHub Pages**.
- В самом приложении (внизу страницы) отображаются **Version/commit/env**, чтобы быстро понимать, какая сборка сейчас открыта.

## Структура проекта
- `src/` — исходный код React-приложения
  - `App.jsx` — основной компонент
  - `Calculator.jsx` — калькулятор модельного времени
  - `main.jsx` — точка входа
  - `index.css` — стили
- `modelTableRUSSIA.js`, `modelTableWORLD.js` — таблицы модельных времён
- `distanceTable.js` — поддерживаемые дистанции
- `utils.js` — функции для работы с временем и расчётами

## Лицензия
MIT
