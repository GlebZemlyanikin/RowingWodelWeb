import SegmentRow from './SegmentRow';

export default function AthleteCard({
    athlete,
    currentModel,
    distances: distanceOptions,
    canRemoveAthlete,
    onAthleteChange,
    onSegmentChange,
    onRemoveAthlete,
    onAddSegment,
    onRemoveSegment,
}) {
    const nameId = `athlete-name-${athlete.id}`;
    const categoryId = `athlete-category-${athlete.id}`;
    const boatId = `athlete-boat-${athlete.id}`;

    return (
        <div className="calculator-section calculator-athlete-block">
            <div className="calculator-flex-row">
                <label htmlFor={nameId} className="calculator-visually-hidden">
                    Имя спортсмена
                </label>
                <input
                    id={nameId}
                    className="calculator-input"
                    placeholder="Имя"
                    value={athlete.name}
                    onChange={(e) =>
                        onAthleteChange(athlete.id, 'name', e.target.value)
                    }
                />
                <label htmlFor={categoryId} className="calculator-visually-hidden">
                    Категория
                </label>
                <select
                    id={categoryId}
                    className="calculator-select"
                    value={athlete.category}
                    onChange={(e) =>
                        onAthleteChange(athlete.id, 'category', e.target.value)
                    }
                >
                    {Object.keys(currentModel).map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <label htmlFor={boatId} className="calculator-visually-hidden">
                    Класс лодки
                </label>
                <select
                    id={boatId}
                    className="calculator-select"
                    value={athlete.boat}
                    onChange={(e) =>
                        onAthleteChange(athlete.id, 'boat', e.target.value)
                    }
                >
                    {Object.keys(currentModel[athlete.category]).map((boat) => (
                        <option key={boat} value={boat}>
                            {boat}
                        </option>
                    ))}
                </select>
                {canRemoveAthlete && (
                    <button
                        type="button"
                        className="calculator-btn calculator-btn-danger"
                        onClick={() => onRemoveAthlete(athlete.id)}
                        aria-label="Удалить спортсмена"
                    >
                        ✕
                    </button>
                )}
            </div>
            <div className="calculator-segments-wrap">
                <b className="calculator-segments-title">Отрезки:</b>
                {athlete.segments.map((seg) => (
                    <SegmentRow
                        key={seg.id}
                        athleteId={athlete.id}
                        segment={seg}
                        distances={distanceOptions}
                        showRemove={athlete.segments.length > 1}
                        onSegmentChange={onSegmentChange}
                        onRemoveSegment={onRemoveSegment}
                        timeInputId={`seg-time-${athlete.id}-${seg.id}`}
                        distanceSelectId={`seg-dist-${athlete.id}-${seg.id}`}
                    />
                ))}
                <button
                    type="button"
                    className="calculator-btn"
                    onClick={() => onAddSegment(athlete.id)}
                >
                    Добавить отрезок
                </button>
            </div>
        </div>
    );
}
