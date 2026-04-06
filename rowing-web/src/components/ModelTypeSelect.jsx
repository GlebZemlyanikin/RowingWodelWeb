import React from 'react';

export function ModelTypeSelect({ modelType, modelTypes, onChange, styles, theme }) {
    return (
        <div style={{ ...styles.flexRow, ...styles.section }}>
            <div>
                <label
                    style={{
                        color: theme === 'dark' ? '#fff' : '#2a3b5d',
                        fontWeight: 500,
                    }}
                >
                    Тип модели:{' '}
                </label>
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

