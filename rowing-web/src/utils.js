// Вспомогательные функции для работы с временем и расчетами

export function parseTimeToSeconds(timeStr) {
    try {
        const s = String(timeStr ?? '')
            .trim()
            .replace(/\s+/g, '')
            .replace(/,/g, '.');

        // Handle format MM:SS.ss
        if (s.includes(":")) {
            const [minutes, seconds] = s.split(":").map(Number)
            if (isNaN(minutes) || isNaN(seconds)) {
                return 0
            }
            return minutes * 60 + seconds
        }
        // Handle format MM.SS.ss (minutes.seconds.hundredths)
        if (s.split(".").length === 3) {
            const parts = s.split(".")
            const minutes = parseInt(parts[0])
            const seconds = parseFloat(parts[1] + "." + parts[2])
            if (isNaN(minutes) || isNaN(seconds)) {
                return 0
            }
            return minutes * 60 + seconds
        }
        // Handle format SS.ss - normalize decimal places
        const seconds = parseFloat(s)
        if (isNaN(seconds)) {
            return 0
        }
        return Math.round(seconds * 100) / 100
    } catch {
        return 0
    }
}

export function formatTime(seconds) {
    try {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = (seconds % 60).toFixed(2)
        return `${minutes}:${remainingSeconds.padStart(5, "0")}`
    } catch {
        return "0:00.00"
    }
}

export function avg(arr) {
    try {
        if (!arr || arr.length === 0) return 0
        return arr.reduce((a, b) => a + b, 0) / arr.length
    } catch {
        return 0
    }
}

export function calculateModelPercentage(baseModelTime, distance, userTime) {
    if (!baseModelTime || !distance || !userTime) return 0;
    const modelSpeed = 2000 / baseModelTime;
    const userSpeed = distance / userTime;
    return (userSpeed / modelSpeed) * 100;
} 