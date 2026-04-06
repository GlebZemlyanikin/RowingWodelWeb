import * as XLSX from 'xlsx';
import {
    calculateModelPercentage,
    parseTimeToSeconds,
    formatTime,
    avg,
} from '../utils';

/**
 * @param {Array<{ name: string, category: string, boat: string, segments: Array<{ distance: number, time: string }> }>} athletes
 * @param {Record<string, Record<string, number>>} currentModel
 */
export function computeResults(athletes, currentModel) {
    const maxSeg = Math.max(
        0,
        ...athletes.map((a) => a.segments.length)
    );
    const results = athletes.map(({ name, category, boat, segments }) => {
        const baseModelTime = currentModel[category][boat];
        const segs = segments.map(({ distance, time }) => {
            const userTime = parseTimeToSeconds(time);
            const percent =
                userTime > 0
                    ? calculateModelPercentage(
                          baseModelTime,
                          distance,
                          userTime
                      )
                    : null;
            return {
                distance,
                time,
                percent,
                seconds: userTime > 0 ? userTime : null,
            };
        });
        const validTimes = segs
            .filter((s) => s.seconds != null)
            .map((s) => s.seconds);
        const avgTime = validTimes.length > 0 ? avg(validTimes) : null;
        const validPercents = segs
            .filter((s) => s.percent != null)
            .map((s) => s.percent);
        const avgPercent =
            validPercents.length > 0 ? avg(validPercents) : null;
        return {
            name,
            category,
            boat,
            segs,
            avgTime,
            avgPercent,
        };
    });
    return { results, maxSegments: maxSeg };
}

export function buildExportSheetData(results, maxSegments) {
    const headers = ['Имя', 'Категория', 'Класс лодки'];
    for (let i = 0; i < maxSegments; ++i) {
        headers.push(`Дистанция${i + 1}`);
        headers.push(`Время${i + 1}`);
        headers.push(`Модель${i + 1}`);
    }
    headers.push('Среднее время');
    headers.push('Средняя модель');
    const wsData = [headers];
    results.forEach((r) => {
        const row = [r.name, r.category, r.boat];
        for (let i = 0; i < maxSegments; ++i) {
            if (r.segs[i]) {
                row.push(r.segs[i].distance);
                row.push(r.segs[i].time);
                row.push(
                    r.segs[i].percent != null
                        ? `${r.segs[i].percent.toFixed(2)}%`
                        : ''
                );
            } else {
                row.push('');
                row.push('');
                row.push('');
            }
        }
        row.push(r.avgTime != null ? formatTime(r.avgTime) : '');
        row.push(r.avgPercent != null ? `${r.avgPercent.toFixed(2)}%` : '');
        wsData.push(row);
    });
    return wsData;
}

export function exportResultsToXlsx(
    results,
    maxSegments,
    filename = 'results.xlsx'
) {
    const wsData = buildExportSheetData(results, maxSegments);
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Результаты');
    XLSX.writeFile(wb, filename);
}
