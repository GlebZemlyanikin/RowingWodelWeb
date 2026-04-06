import React from 'react';
import { ResultsTable } from './ResultsTable';

export function ResultsSection({ results, maxSegments, onExport, styles, theme }) {
    if (results.length === 0) return null;

    return (
        <div style={{ marginTop: 32 }}>
            <h3 style={{ color: theme === 'dark' ? '#fff' : '#2a3b5d' }}>
                Результаты
            </h3>
            <ResultsTable results={results} maxSegments={maxSegments} styles={styles} />
            <button style={{ ...styles.button, marginTop: 16 }} onClick={onExport}>
                Экспорт в Excel
            </button>
        </div>
    );
}

