// Константы приложения
const WEB_URL = 'https://glebzemlyanikin.github.io/RowingWodelWeb/';

const worldAgeCategories = [
    'Юноши до 19',
    'Девушки до 19',
    'Юниоры до 23',
    'Юниорки до 23',
    'Мужчина',
    'Женщины',
];

const russiaAgeCategories = [
    'Юноши до 15',
    'Девушки до 15',
    'Юноши до 17',
    'Девушки до 17',
    'Юноши до 19',
    'Девушки до 19',
    'Юниоры до 23',
    'Юниорки до 23',
    'Мужчина',
    'Женщины',
];

const boatClasses = [
    '1х',
    '1х л/в',
    '2-',
    '2- л/в',
    '2х',
    '2х л/в',
    '4-',
    '4х',
    '4х л/в',
    '4+',
    '8+',
];

const STATES = {
    IDLE: 'IDLE',
    WAITING_MODEL_TYPE: 'WAITING_MODEL_TYPE',
    WAITING_MODE: 'WAITING_MODE',
    WAITING_NAME: 'WAITING_NAME',
    WAITING_AGE: 'WAITING_AGE',
    WAITING_DISTANCE: 'WAITING_DISTANCE',
    WAITING_BOAT: 'WAITING_BOAT',
    WAITING_TIME: 'WAITING_TIME',
    WAITING_NEXT_ACTION: 'WAITING_NEXT_ACTION',
    EDITING_LAST_TIME: 'EDITING_LAST_TIME',
};

// Сообщения (single language)
const messages = {
    selectModel: 'Выберите тип модели:',
    selectMode: 'Выберите режим работы:',
    enterName: 'Введите имя или фамилию:',
    selectAge: 'Выберите возрастную категорию:',
    selectDistance: 'Выберите дистанцию',
    selectBoat: 'Выберите класс лодки',
    enterTime:
        'Введите время в формате СС.сс или ММ:СС.сс (например, 45.55 или 7:45.55)',
    cancel: 'Отмена',
    settings: 'Настройки:',
    changeLanguage: 'Изменить язык',
    selectLanguage: 'Выберите язык:',
    languageChanged: 'Язык изменен',
    back: 'Назад',
    invalidModel: 'Пожалуйста, выберите тип модели из предложенных вариантов',
    invalidMode: 'Пожалуйста, выберите режим из предложенных вариантов',
    invalidAge: 'Пожалуйста, выберите категорию из предложенных вариантов',
    invalidDistance: 'Пожалуйста, выберите дистанцию из предложенных вариантов',
    invalidBoat: 'Пожалуйста, выберите класс лодки из предложенных вариантов',
    invalidTime:
        'Пожалуйста, введите время в формате СС.сс или ММ:СС.сс (например, 45.55 или 7:45.55). Также можно использовать формат ММ.СС.сс (например, 7.45.55).',
    invalidSeconds:
        'Пожалуйста, введите время в формате СС.сс или ММ:СС.сс (например, 45.5 или 7:45.5). Секунды не могут быть больше 59.',
    calculationError:
        'Произошла ошибка при расчете модельного времени. Пожалуйста, попробуйте снова.',
    useStart: 'Используйте /start для нового расчета',
    selectAction: 'Выберите действие:',
    enterMoreTime: 'Ввести еще время',
    newName: 'Новое имя',
    finishAndGetExcel: 'Завершить и получить Excel',
    editLastTime: 'Редактировать последнее время',
    viewHistory: 'Просмотреть историю',
    noResults: 'Нет результатов для редактирования',
    historyEmpty: 'История пуста',
    timeUpdated: 'Время успешно обновлено',
    invalidAction: 'Пожалуйста, выберите действие из предложенных вариантов',
    excelError:
        'Произошла ошибка при создании Excel файла. Пожалуйста, попробуйте снова.',
    noDataForExcel:
        'Нет данных для создания Excel файла. Используйте /start для начала.',
    worldModel: 'Мировая модель',
    russiaModel: 'Российская модель (Н.Н.)',
    singleTime: 'Ввести одно время',
    createFile: 'Создать файл с результатами',
    mainMenu: 'Главное меню',
    modelError: 'Ошибка при расчете модели. Пожалуйста, попробуйте снова.',
    timeResult: 'ваше время: {time}\nваша модель: {percentage}%',
};

function getMessage(chatId, key) {
    return messages[key] || key;
}

module.exports = {
    WEB_URL,
    worldAgeCategories,
    russiaAgeCategories,
    boatClasses,
    STATES,
    messages,
    getMessage,
};

