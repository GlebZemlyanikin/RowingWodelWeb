const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

const userSessions = new Map();
const userStates = new Map();
const userSettings = new Map(); // Для совместимости с backup.js

function initUserState(chatId) {
    const { STATES } = require('../config/constants');
    userStates.set(chatId, {
        state: STATES.WAITING_MODEL_TYPE,
        modelType: null,
        mode: null,
        name: null,
        ageCategory: null,
        distance: null,
        boatClass: null,
        time: null,
    });
}

function initUserSession(chatId, username) {
    userSessions.set(chatId, {
        username,
        chatId,
        startTime: new Date().toISOString(),
        actions: [],
        results: [],
    });
}

function logUserAction(chatId, action, details = {}) {
    const session = userSessions.get(chatId);
    if (session) {
        session.actions.push({
            timestamp: new Date().toISOString(),
            action,
            ...details,
        });
    }
}

function saveSession(chatId) {
    try {
        const session = userSessions.get(chatId);
        if (session) {
            const sessionsDir = path.join(process.cwd(), 'sessions');
            if (!fs.existsSync(sessionsDir)) {
                fs.mkdirSync(sessionsDir, { recursive: true });
            }

            const filename = path.join(
                sessionsDir,
                `${session.username}_${session.chatId}_${session.startTime.replace(/[:.]/g, '-')}.json`
            );
            fs.writeFileSync(filename, JSON.stringify(session, null, 2));

            logger.logWithContext('info', 'Session saved', {
                chatId,
                username: session.username,
                filename,
            });
        }
    } catch (error) {
        logger.logWithContext('warn', 'Could not save session', {
            chatId,
            error: error.message,
        });
    }
}

async function saveResult(chatId, result) {
    try {
        let session = userSessions.get(chatId);
        if (!session) {
            logger.logWithContext('warn', 'Session not found, creating new session', {
                chatId,
            });
            const username = `User_${chatId}`;
            initUserSession(chatId, username);
            session = userSessions.get(chatId);
        }

        const { formatTime } = require('../utils');
        const formattedTime = formatTime(result.time);

        session.results.push({
            name: result.name,
            distance: result.distance,
            boatClass: result.boatClass,
            ageCategory: result.ageCategory,
            time: formattedTime,
            modelTime: result.modelTime,
            modelPercentage: result.percentage,
            modelType: result.modelType,
            timestamp: new Date().toISOString(),
        });

        logger.logWithContext('info', 'Result saved', {
            chatId,
            username: session.username,
            name: result.name,
            time: formattedTime,
            percentage: result.percentage,
        });

        saveSession(chatId);

        return true;
    } catch (error) {
        logger.logWithContext('error', 'Error saving result', {
            chatId,
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
}

function getUserState(chatId) {
    return userStates.get(chatId);
}

function getUserSession(chatId) {
    return userSessions.get(chatId);
}

function deleteUserSession(chatId) {
    userSessions.delete(chatId);
    userStates.delete(chatId);
}

module.exports = {
    userSessions,
    userStates,
    userSettings,
    initUserState,
    initUserSession,
    logUserAction,
    saveSession,
    saveResult,
    getUserState,
    getUserSession,
    deleteUserSession,
};

