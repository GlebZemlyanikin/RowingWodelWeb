const { getModelTime, modelTimesWORLD } = require('../modelTableWORLD');
const {
    getModelTime: getModelTimeRU,
    modelTimesRUSSIA,
} = require('../modelTableRUSSIA');
const { calculateModelPercentage } = require('../utils');
const { getMessage } = require('../config/constants');
const logger = require('../config/logger');

function calculateModelTime(userState, userTime, chatId) {
    try {
        const isWorldModel = userState.modelType === getMessage(chatId, 'worldModel');

        const modelTime = isWorldModel
            ? getModelTime(
                  userState.ageCategory,
                  userState.distance,
                  userState.boatClass,
                  userTime
              )
            : getModelTimeRU(
                  userState.ageCategory,
                  userState.distance,
                  userState.boatClass,
                  userTime
              );

        const baseModelTime = isWorldModel
            ? modelTimesWORLD[userState.ageCategory]?.[userState.boatClass]
            : modelTimesRUSSIA[userState.ageCategory]?.[userState.boatClass];

        const percentage = baseModelTime
            ? calculateModelPercentage(
                  baseModelTime,
                  userState.distance,
                  userTime
              ).toFixed(2)
            : '0.00';

        logger.logWithContext('info', 'Model time calculated', {
            chatId,
            modelType: userState.modelType,
            ageCategory: userState.ageCategory,
            distance: userState.distance,
            boatClass: userState.boatClass,
            userTime,
            modelTime,
            percentage,
        });

        return {
            modelTime,
            percentage,
            baseModelTime,
        };
    } catch (error) {
        logger.logWithContext('error', 'Error calculating model time', {
            chatId,
            error: error.message,
            stack: error.stack,
            userState,
            userTime,
        });
        throw error;
    }
}

function updateResultTime(session, lastResult, newTimeSeconds, chatId) {
    try {
        const modelTable =
            lastResult.modelType === getMessage(chatId, 'worldModel')
                ? modelTimesWORLD
                : modelTimesRUSSIA;
        const baseModelTime =
            modelTable[lastResult.ageCategory]?.[lastResult.boatClass];

        const newPercentage = baseModelTime
            ? calculateModelPercentage(
                  baseModelTime,
                  lastResult.distance,
                  newTimeSeconds
              ).toFixed(2)
            : '0.00';

        const { formatTime } = require('../utils');
        lastResult.time = formatTime(newTimeSeconds);
        lastResult.modelPercentage = newPercentage;

        logger.logWithContext('info', 'Result time updated', {
            chatId,
            oldTime: lastResult.time,
            newTime: formatTime(newTimeSeconds),
            newPercentage,
        });

        return { success: true };
    } catch (error) {
        logger.logWithContext('error', 'Error updating result time', {
            chatId,
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
}

module.exports = {
    calculateModelTime,
    updateResultTime,
};

