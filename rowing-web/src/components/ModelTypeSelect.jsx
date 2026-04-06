export default function ModelTypeSelect({ id, value, options, onChange }) {
    return (
        <div className="calculator-model-row calculator-section">
            <div>
                <label htmlFor={id} className="calculator-label">
                    Тип модели:{' '}
                </label>
                <select
                    id={id}
                    className="calculator-select"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
