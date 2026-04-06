import React from 'react';

export function ModelTypeSelect({ modelType, modelTypes, onChange, styles }) {
    return (
        <div style={{ ...styles.section }}>
            <div style={styles.sectionTitleRow}>
                <h3 style={styles.sectionTitle}>🧠 Тип модели</h3>
                <p style={styles.sectionHint}>Выберите таблицу для расчёта</p>
            </div>
            <div style={styles.flexRow}>
                <select
                    value={modelType}
                    onChange={(e) => onChange(e.target.value)}
                    style={styles.select}
                >
                    {modelTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

