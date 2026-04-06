import { getDistance } from '../../distanceTable';

export default function SegmentRow({
    athleteId,
    segment,
    distances: distanceOptions,
    showRemove,
    onSegmentChange,
    onRemoveSegment,
    timeInputId,
    distanceSelectId,
}) {
    return (
        <div className="calculator-flex-row">
            <label htmlFor={distanceSelectId} className="calculator-visually-hidden">
                Дистанция отрезка
            </label>
            <select
                id={distanceSelectId}
                className="calculator-select"
                value={segment.distance}
                onChange={(e) =>
                    onSegmentChange(
                        athleteId,
                        segment.id,
                        'distance',
                        Number(e.target.value)
                    )
                }
            >
                {distanceOptions.map((d) => (
                    <option key={d} value={getDistance(d)}>
                        {d}
                    </option>
                ))}
            </select>
            <input
                id={timeInputId}
                className="calculator-input"
                placeholder="Время (например, 7:45.55)"
                value={segment.time}
                onChange={(e) =>
                    onSegmentChange(
                        athleteId,
                        segment.id,
                        'time',
                        e.target.value
                    )
                }
                aria-label="Время на отрезке"
            />
            {showRemove && (
                <button
                    type="button"
                    className="calculator-btn calculator-btn-danger"
                    onClick={() => onRemoveSegment(athleteId, segment.id)}
                    aria-label="Удалить отрезок"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
