import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import {
    avg,
    calculateModelPercentage,
    formatTime,
    parseTimeToSeconds,
} from '../utils';

let uidCounter = 0;
function uid(prefix) {
    uidCounter += 1;
    return `${prefix}_${Date.now()}_${uidCounter}`;
}

export function useCalculatorState({ modelTables, distances }) {
    const modelTypes = useMemo(() => Object.keys(modelTables), [modelTables]);
    const [modelType, setModelType] = useState(modelTypes[0]);

    const currentModel = modelTables[modelType];

    const defaults = useMemo(() => {
        const defaultCategory = Object.keys(currentModel)[0];
        const defaultBoat = Object.keys(currentModel[defaultCategory])[0];
        const preferred = '2000';
        const preferredDistanceStr =
            distances.find((d) => String(d).includes(preferred)) ?? distances[0];
        const defaultDistance = Number.parseInt(preferredDistanceStr, 10);
        return { defaultCategory, defaultBoat, defaultDistance };
    }, [currentModel, distances]);

    const [athletes, setAthletes] = useState(() => [
        {
            id: uid('ath'),
            name: '',
            category: defaults.defaultCategory,
            boat: defaults.defaultBoat,
            segments: [
                {
                    id: uid('seg'),
                    distance: defaults.defaultDistance,
                    time: '',
                },
            ],
        },
    ]);

    const [results, setResults] = useState([]);
    const [maxSegments, setMaxSegments] = useState(1);

    useEffect(() => {
        setAthletes((prev) =>
            prev.map((ath) => {
                const category = Object.keys(currentModel)[0];
                const boat = Object.keys(currentModel[category])[0];
                return { ...ath, category, boat };
            }),
        );
    }, [currentModel]);

    const handleAthleteChange = (athleteId, field, value) => {
        setAthletes((prev) =>
            prev.map((ath) => {
                if (ath.id !== athleteId) return ath;
                if (field === 'category') {
                    const newBoat = Object.keys(currentModel[value])[0];
                    return { ...ath, category: value, boat: newBoat };
                }
                return { ...ath, [field]: value };
            }),
        );
    };

    const handleSegmentChange = (athleteId, segmentId, field, value) => {
        setAthletes((prev) =>
            prev.map((ath) => {
                if (ath.id !== athleteId) return ath;
                return {
                    ...ath,
                    segments: ath.segments.map((seg) =>
                        seg.id === segmentId ? { ...seg, [field]: value } : seg,
                    ),
                };
            }),
        );
    };

    const addAthlete = () => {
        setAthletes((prev) => [
            ...prev,
            {
                id: uid('ath'),
                name: '',
                category: defaults.defaultCategory,
                boat: defaults.defaultBoat,
                segments: [
                    {
                        id: uid('seg'),
                        distance: defaults.defaultDistance,
                        time: '',
                    },
                ],
            },
        ]);
    };

    const removeAthlete = (athleteId) => {
        setAthletes((prev) => prev.filter((ath) => ath.id !== athleteId));
    };

    const addSegment = (athleteId) => {
        setAthletes((prev) =>
            prev.map((ath) => {
                if (ath.id !== athleteId) return ath;
                return {
                    ...ath,
                    segments: [
                        ...ath.segments,
                        {
                            id: uid('seg'),
                            distance: defaults.defaultDistance,
                            time: '',
                        },
                    ],
                };
            }),
        );
    };

    const removeSegment = (athleteId, segmentId) => {
        setAthletes((prev) =>
            prev.map((ath) => {
                if (ath.id !== athleteId) return ath;
                return {
                    ...ath,
                    segments: ath.segments.filter(
                        (seg) => seg.id !== segmentId,
                    ),
                };
            }),
        );
    };

    const calculate = () => {
        const maxSeg = Math.max(1, ...athletes.map((a) => a.segments.length));
        setMaxSegments(maxSeg);

        const res = athletes.map(({ name, category, boat, segments }) => {
            const baseModelTime = currentModel[category][boat];
            const segs = segments.map(({ distance, time }) => {
                const userTime = parseTimeToSeconds(time);
                const percent =
                    userTime > 0
                        ? calculateModelPercentage(
                              baseModelTime,
                              distance,
                              userTime,
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

            return { name, category, boat, segs, avgTime, avgPercent };
        });

        setResults(res);
    };

    const exportToExcel = () => {
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
                            : '',
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

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const headerMin = headers.map((h) => String(h).length);
        ws['!cols'] = headers.map((_, colIndex) => {
            const maxLen = wsData.reduce((acc, row) => {
                const s = String(row[colIndex] ?? '');
                return Math.max(acc, s.length);
            }, 0);

            // Ширина в "символах": минимум по заголовку, дальше по контенту.
            // +2 — небольшой запас, 60 — верхняя граница, чтобы не раздувать лист.
            const wch = Math.min(60, Math.max(headerMin[colIndex], maxLen) + 2);
            return { wch };
        });

        const ref = ws['!ref'];
        if (ref) {
            const range = XLSX.utils.decode_range(ref);
            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const addr = XLSX.utils.encode_cell({ r: R, c: C });
                    const cell = ws[addr];
                    if (!cell) continue;

                    const baseStyle = {
                        alignment: { horizontal: 'center', vertical: 'center' },
                    };
                    cell.s =
                        R === 0
                            ? { ...baseStyle, font: { bold: true } }
                            : baseStyle;
                }
            }
        }
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Результаты');

        // На некоторых мобильных браузерах `XLSX.writeFile()` может не инициировать загрузку.
        // Поэтому формируем Blob и делаем скачивание через временную ссылку с `download`.
        try {
            const wbout = XLSX.write(wb, {
                bookType: 'xlsx',
                type: 'array',
                cellStyles: true,
            });

            const blob = new Blob([wbout], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const filename = 'results.xlsx';

            // `file-saver` обычно надёжнее для iOS/Android, чем ручной `<a download>`.
            try {
                saveAs(blob, filename);
            } catch {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.rel = 'noopener';
                a.style.display = 'none';

                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 0);
            }
        } catch (e) {
            console.error('Excel export failed', e);
        }
    };

    return {
        modelType,
        setModelType,
        modelTypes,
        currentModel,
        athletes,
        results,
        maxSegments,
        handleAthleteChange,
        handleSegmentChange,
        addAthlete,
        removeAthlete,
        addSegment,
        removeSegment,
        calculate,
        exportToExcel,
        defaults,
    };
}
