import React from 'react';

export function SegmentList({
    athleteId,
    segments,
    distances,
    onSegmentChange,
    onAddSegment,
    onRemoveSegment,
    styles,
    theme,
}) {
    return (
        <div style={{ marginTop: 8 }}>
            <b
                style={{
                    color: theme === 'dark' ? '#fff' : '#2a3b5d',
                    fontWeight: 500,
                }}
            >
                Отрезки:
            </b>
            {segments.map((seg) => (
                <div key={seg.id} style={styles.flexRow}>
                    <select
                        value={seg.distance}
                        onChange={(e) =>
                            onSegmentChange(
                                athleteId,
                                seg.id,
                                'distance',
                                Number(e.target.value)
                            )
                        }
                        style={styles.select}
                        onFocus={(e) => {
                            e.currentTarget.style.boxShadow =
                                styles._tokens?.focusRing ?? '';
                            e.currentTarget.style.borderColor =
                                styles._tokens?.colors?.primary ?? '#4f8cff';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.boxShadow = '';
                            e.currentTarget.style.borderColor = '';
                        }}
                    >
                        {distances.map((d) => (
                            <option key={d} value={Number.parseInt(d, 10)}>
                                {d}
                            </option>
                        ))}
                    </select>
                    <input
                        placeholder="Время (например, 7:45.55)"
                        value={seg.time}
                        onChange={(e) =>
                            onSegmentChange(
                                athleteId,
                                seg.id,
                                'time',
                                e.target.value.replace(/,/g, '.')
                            )
                        }
                        style={styles.input}
                        onFocus={(e) => {
                            e.currentTarget.style.boxShadow =
                                styles._tokens?.focusRing ?? '';
                            e.currentTarget.style.borderColor =
                                styles._tokens?.colors?.primary ?? '#4f8cff';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.boxShadow = '';
                            e.currentTarget.style.borderColor = '';
                        }}
                    />
                    {segments.length > 1 && (
                        <button
                            onClick={() => onRemoveSegment(athleteId, seg.id)}
                            style={{ ...styles.button, ...styles.buttonDanger }}
                            onMouseDown={(e) => {
                                e.currentTarget.style.transform =
                                    'translateY(0px) scale(0.98)';
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.style.transform =
                                    'translateY(0px) scale(1)';
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={() => onAddSegment(athleteId)}
                style={styles.button}
                onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px) scale(0.98)';
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                }}
            >
                ➕ Добавить отрезок
            </button>
        </div>
    );
}

