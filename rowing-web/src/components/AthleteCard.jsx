import React from 'react';
import { SegmentList } from './SegmentList';

export function AthleteCard({
    athlete,
    athleteId,
    canRemove,
    categories,
    boats,
    distances,
    onAthleteChange,
    onRemoveAthlete,
    onSegmentChange,
    onAddSegment,
    onRemoveSegment,
    styles,
    theme,
}) {
    return (
        <div style={{ ...styles.section, ...styles.segmentBlock }}>
            <div style={styles.flexRow}>
                <input
                    placeholder="Имя"
                    value={athlete.name}
                    onChange={(e) =>
                        onAthleteChange(athleteId, 'name', e.target.value)
                    }
                    style={styles.input}
                />
                <select
                    value={athlete.category}
                    onChange={(e) =>
                        onAthleteChange(athleteId, 'category', e.target.value)
                    }
                    style={styles.select}
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <select
                    value={athlete.boat}
                    onChange={(e) =>
                        onAthleteChange(athleteId, 'boat', e.target.value)
                    }
                    style={styles.select}
                >
                    {boats.map((boat) => (
                        <option key={boat} value={boat}>
                            {boat}
                        </option>
                    ))}
                </select>
                {canRemove && (
                    <button
                        onClick={() => onRemoveAthlete(athleteId)}
                        style={{ ...styles.button, ...styles.buttonDanger }}
                    >
                        ✕
                    </button>
                )}
            </div>

            <SegmentList
                athleteId={athleteId}
                segments={athlete.segments}
                distances={distances}
                onSegmentChange={onSegmentChange}
                onAddSegment={onAddSegment}
                onRemoveSegment={onRemoveSegment}
                styles={styles}
                theme={theme}
            />
        </div>
    );
}

