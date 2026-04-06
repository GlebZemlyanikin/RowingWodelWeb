import React, { useEffect, useRef, useState } from 'react';
import { ResultsTable } from './ResultsTable';
import { ResultsCards } from './ResultsCards';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function ResultsSection({ results, maxSegments, onExport, styles }) {
    const isMobile = useMediaQuery('(max-width: 720px)');
    const [maxH, setMaxH] = useState(0);
    const contentRef = useRef(null);

    const isOpen = results.length > 0;

    useEffect(() => {
        if (!isOpen) {
            setMaxH(0);
            return;
        }
        const el = contentRef.current;
        if (!el) return;
        const measure = () => setMaxH(el.scrollHeight);
        measure();
        const raf = requestAnimationFrame(measure);
        return () => cancelAnimationFrame(raf);
    }, [isOpen, results, isMobile, maxSegments]);

    return (
        <div style={{ marginTop: 18 }}>
            <div style={styles.sectionTitleRow}>
                <h3 style={styles.sectionTitle}>📋 Результаты</h3>
                <p style={styles.sectionHint}>
                    {isMobile ? 'Карточки на мобильном' : 'Таблица на десктопе'}
                </p>
            </div>

            <div
                style={{
                    overflow: 'hidden',
                    maxHeight: isOpen ? maxH : 0,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0px)' : 'translateY(-4px)',
                    transition: 'max-height 260ms ease, opacity 220ms ease, transform 220ms ease',
                    willChange: 'max-height, opacity, transform',
                }}
                aria-hidden={!isOpen}
            >
                <div ref={contentRef}>
                    {isOpen ? (
                        <>
                            {isMobile ? (
                                <ResultsCards results={results} styles={styles} />
                            ) : (
                                <ResultsTable
                                    results={results}
                                    maxSegments={maxSegments}
                                    styles={styles}
                                />
                            )}
                            <button
                                style={{ ...styles.button, marginTop: 16 }}
                                onClick={onExport}
                            >
                                ⬇️ Экспорт в Excel
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

