import React from 'react';
import { ResultsTable } from './ResultsTable';
import { ResultsCards } from './ResultsCards';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function ResultsSection({ results, maxSegments, onExport, styles, theme }) {
    const isMobile = useMediaQuery('(max-width: 720px)');
    if (results.length === 0) return null;

    return (
        <div style={{ marginTop: 32 }}>
            <h3 style={{ color: theme === 'dark' ? '#fff' : '#2a3b5d', marginBottom: 10 }}>
                📋 Результаты
            </h3>
            {isMobile ? (
                <ResultsCards results={results} styles={styles} />
            ) : (
                <ResultsTable results={results} maxSegments={maxSegments} styles={styles} />
            )}
            <button style={{ ...styles.button, marginTop: 16 }} onClick={onExport}>
                ⬇️ Экспорт в Excel
            </button>
        </div>
    );
}

