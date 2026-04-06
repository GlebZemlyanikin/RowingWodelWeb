import React from 'react';
import { AthleteCard } from './AthleteCard';

export function AthletesSection({
    athletes,
    currentModel,
    distances,
    onAthleteChange,
    onRemoveAthlete,
    onSegmentChange,
    onAddSegment,
    onRemoveSegment,
    onAddAthlete,
    onCalculate,
    styles,
    theme,
}) {
    return (
        <>
            <h3 style={{ color: theme === 'dark' ? '#fff' : '#2a3b5d' }}>
                Данные спортсменов
            </h3>
            {athletes.map((ath) => (
                <AthleteCard
                    key={ath.id}
                    athlete={ath}
                    athleteId={ath.id}
                    canRemove={athletes.length > 1}
                    categories={Object.keys(currentModel)}
                    boats={Object.keys(currentModel[ath.category])}
                    distances={distances}
                    onAthleteChange={onAthleteChange}
                    onRemoveAthlete={onRemoveAthlete}
                    onSegmentChange={onSegmentChange}
                    onAddSegment={onAddSegment}
                    onRemoveSegment={onRemoveSegment}
                    styles={styles}
                    theme={theme}
                />
            ))}

            <button onClick={onAddAthlete} style={styles.button}>
                Добавить спортсмена
            </button>
            <br />
            <button
                style={{ ...styles.button, marginTop: 10, width: 180 }}
                onClick={onCalculate}
            >
                Рассчитать
            </button>
        </>
    );
}

