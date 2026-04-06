import React, { useState } from 'react';
import { modelTimesWORLD } from './modelTableWORLD';
import { modelTimesRUSSIA } from './modelTableRUSSIA';
import { distances } from './distanceTable';
import { ThemeToggle } from './components/ThemeToggle';
import { ModelTypeSelect } from './components/ModelTypeSelect';
import { AthletesSection } from './components/AthletesSection';
import { ResultsSection } from './components/ResultsSection';
import { useCalculatorState } from './hooks/useCalculatorState';
import { getStyles } from './styles/getStyles';

export default function Calculator() {
    const [theme, setTheme] = useState('light');
    const styles = getStyles(theme);
    const modelTables = {
        'Мировая модель': modelTimesWORLD,
        'Российская модель (Н.Н.)': modelTimesRUSSIA,
    };
    const {
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
    } = useCalculatorState({ modelTables, distances });

    return (
        <div style={styles.page}>
            <ThemeToggle
                theme={theme}
                onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                style={styles.themeToggle}
            />
            <div style={styles.card}>
                <h2 style={{ ...styles.title, marginBottom: 22 }}>
                    🧮 Калькулятор модельного времени
                </h2>
                <ModelTypeSelect
                    modelType={modelType}
                    modelTypes={modelTypes}
                    onChange={setModelType}
                    styles={styles}
                    theme={theme}
                />
                <hr style={{ margin: '20px 0' }} />
                <AthletesSection
                    athletes={athletes}
                    currentModel={currentModel}
                    distances={distances}
                    onAthleteChange={handleAthleteChange}
                    onRemoveAthlete={removeAthlete}
                    onSegmentChange={handleSegmentChange}
                    onAddSegment={addSegment}
                    onRemoveSegment={removeSegment}
                    onAddAthlete={addAthlete}
                    onCalculate={calculate}
                    styles={styles}
                    theme={theme}
                />

                <ResultsSection
                    results={results}
                    maxSegments={maxSegments}
                    onExport={exportToExcel}
                    styles={styles}
                    theme={theme}
                />
            </div>
        </div>
    );
}
