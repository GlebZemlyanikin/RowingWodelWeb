import { useState, useEffect, useCallback, useRef } from 'react';
import { distances, getDistance } from '../../distanceTable';
import {
    MODEL_TABLES,
    DEFAULT_MODEL_TYPE,
} from '../modelTables';
import { computeResults, exportResultsToXlsx } from '../calculatorResults';

function firstCategory(model) {
    return Object.keys(model)[0];
}

function firstBoat(model, category) {
    return Object.keys(model[category])[0];
}

function createSegment(idGen, defaultDistance) {
    return { id: idGen.segmentId(), distance: defaultDistance, time: '' };
}

function createAthlete(model, idGen) {
    const cat = firstCategory(model);
    const boat = firstBoat(model, cat);
    const defaultDistance = getDistance(distances[0]);
    return {
        id: idGen.athleteId(),
        name: '',
        category: cat,
        boat,
        segments: [createSegment(idGen, defaultDistance)],
    };
}

export function useCalculatorState() {
    const [theme, setTheme] = useState('light');
    const [modelType, setModelType] = useState(DEFAULT_MODEL_TYPE);
    const currentModel = MODEL_TABLES[modelType];
    const defaultDistance = getDistance(distances[0]);

    const idRef = useRef({
        athlete: 0,
        segment: 0,
        athleteId() {
            return `ath-${++this.athlete}`;
        },
        segmentId() {
            return `seg-${++this.segment}`;
        },
    });

    const [athletes, setAthletes] = useState(() => [
        createAthlete(MODEL_TABLES[DEFAULT_MODEL_TYPE], idRef.current),
    ]);
    const [results, setResults] = useState([]);
    const [maxSegments, setMaxSegments] = useState(1);

    useEffect(() => {
        const model = MODEL_TABLES[modelType];
        const cat = firstCategory(model);
        const boat = firstBoat(model, cat);
        setAthletes((prev) =>
            prev.map((ath) => ({
                ...ath,
                category: cat,
                boat,
            }))
        );
    }, [modelType]);

    const handleAthleteChange = useCallback(
        (athleteId, field, value) => {
            setAthletes((prev) =>
                prev.map((ath) => {
                    if (ath.id !== athleteId) return ath;
                    if (field === 'category') {
                        const newBoat = firstBoat(currentModel, value);
                        return { ...ath, category: value, boat: newBoat };
                    }
                    return { ...ath, [field]: value };
                })
            );
        },
        [currentModel]
    );

    const handleSegmentChange = useCallback(
        (athleteId, segmentId, field, value) => {
            setAthletes((prev) =>
                prev.map((ath) => {
                    if (ath.id !== athleteId) return ath;
                    return {
                        ...ath,
                        segments: ath.segments.map((seg) =>
                            seg.id === segmentId
                                ? { ...seg, [field]: value }
                                : seg
                        ),
                    };
                })
            );
        },
        []
    );

    const addAthlete = useCallback(() => {
        setAthletes((prev) => [
            ...prev,
            createAthlete(currentModel, idRef.current),
        ]);
    }, [currentModel]);

    const removeAthlete = useCallback((athleteId) => {
        setAthletes((prev) => prev.filter((a) => a.id !== athleteId));
    }, []);

    const addSegment = useCallback(
        (athleteId) => {
            setAthletes((prev) =>
                prev.map((ath) => {
                    if (ath.id !== athleteId) return ath;
                    return {
                        ...ath,
                        segments: [
                            ...ath.segments,
                            createSegment(idRef.current, defaultDistance),
                        ],
                    };
                })
            );
        },
        [defaultDistance]
    );

    const removeSegment = useCallback((athleteId, segmentId) => {
        setAthletes((prev) =>
            prev.map((ath) => {
                if (ath.id !== athleteId) return ath;
                return {
                    ...ath,
                    segments: ath.segments.filter((s) => s.id !== segmentId),
                };
            })
        );
    }, []);

    const handleCalc = useCallback(() => {
        const { results: res, maxSegments: maxSeg } = computeResults(
            athletes,
            currentModel
        );
        setMaxSegments(maxSeg);
        setResults(res);
    }, [athletes, currentModel]);

    const handleExport = useCallback(() => {
        exportResultsToXlsx(results, maxSegments);
    }, [results, maxSegments]);

    const toggleTheme = useCallback(() => {
        setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    }, []);

    return {
        theme,
        toggleTheme,
        modelType,
        setModelType,
        modelTableKeys: Object.keys(MODEL_TABLES),
        currentModel,
        athletes,
        results,
        maxSegments,
        distances,
        defaultDistance,
        handleAthleteChange,
        handleSegmentChange,
        addAthlete,
        removeAthlete,
        addSegment,
        removeSegment,
        handleCalc,
        handleExport,
    };
}
