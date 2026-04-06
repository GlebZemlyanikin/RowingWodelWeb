import React from 'react';
import { formatTime } from '../utils';

function CardRow({ label, value, styles }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '6px 0',
                borderBottom: `1px dashed ${styles._tokens?.colors?.border ?? 'rgba(0,0,0,0.08)'}`,
            }}
        >
            <span style={{ ...styles.mutedText, fontSize: 13 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
        </div>
    );
}

export function ResultsCards({ results, styles }) {
    return (
        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {results.map((r, i) => (
                <div
                    key={i}
                    style={{
                        ...styles.segmentBlock,
                        marginBottom: 0,
                        transform: 'translateY(0px)',
                    }}
                    onMouseEnter={(e) => {
                        const shadowHover = styles._tokens?.shadowHover;
                        if (shadowHover) e.currentTarget.style.boxShadow = shadowHover;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.transform = 'translateY(0px)';
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 12,
                            alignItems: 'baseline',
                            marginBottom: 8,
                        }}
                    >
                        <div style={{ fontSize: 16, fontWeight: 700 }}>
                            🧑‍🚣 {r.name || 'Без имени'}
                        </div>
                        <div style={{ ...styles.mutedText, fontSize: 12 }}>
                            {r.category} · {r.boat}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: 8 }}>
                        {r.segs.map((s, idx) => (
                            <div key={idx} style={{ padding: '8px 10px', borderRadius: 12, background: styles._tokens?.colors?.surface ?? 'rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                                    <span style={{ ...styles.mutedText, fontSize: 12 }}>🏁 Отрезок {idx + 1}</span>
                                    <span style={{ ...styles.number, fontSize: 12 }}>{s.distance} м</span>
                                </div>
                                <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                                    <CardRow label="⏱ Время" value={s.time || '—'} styles={styles} />
                                    <CardRow
                                        label="📊 Модель"
                                        value={s.percent != null ? `${s.percent.toFixed(2)}%` : '—'}
                                        styles={styles}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                        <CardRow
                            label="Среднее время"
                            value={r.avgTime != null ? formatTime(r.avgTime) : '—'}
                            styles={styles}
                        />
                        <CardRow
                            label="Средняя модель"
                            value={r.avgPercent != null ? `${r.avgPercent.toFixed(2)}%` : '—'}
                            styles={styles}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

