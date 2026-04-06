import { Fragment } from 'react';
import { formatTime } from '../../utils';

export default function ResultsTable({
    results,
    maxSegments,
    onExport,
}) {
    if (results.length === 0) return null;

    return (
        <div className="calculator-results">
            <h3 className="calculator-subtitle">Результаты</h3>
            <div className="calculator-table-wrap">
                <table className="calculator-table">
                    <thead>
                        <tr>
                            <th className="calculator-th">Имя</th>
                            <th className="calculator-th">Категория</th>
                            <th className="calculator-th">Класс лодки</th>
                            {Array.from({ length: maxSegments }).map((_, i) => (
                                <Fragment key={`seg-h-${i}`}>
                                    <th className="calculator-th">{`Дистанция${i + 1}`}</th>
                                    <th className="calculator-th">{`Время${i + 1}`}</th>
                                    <th className="calculator-th">{`Модель${i + 1}`}</th>
                                </Fragment>
                            ))}
                            <th className="calculator-th">Среднее время</th>
                            <th className="calculator-th">Средняя модель</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, rowIdx) => (
                            <tr key={`row-${rowIdx}`}>
                                <td className="calculator-td">{r.name}</td>
                                <td className="calculator-td">{r.category}</td>
                                <td className="calculator-td">{r.boat}</td>
                                {Array.from({ length: maxSegments }).map((_, j) =>
                                    r.segs[j] ? (
                                        <Fragment key={`c-${j}`}>
                                            <td className="calculator-td">
                                                {r.segs[j].distance}
                                            </td>
                                            <td className="calculator-td">
                                                {r.segs[j].time}
                                            </td>
                                            <td className="calculator-td">
                                                {r.segs[j].percent != null
                                                    ? `${r.segs[j].percent.toFixed(2)}%`
                                                    : ''}
                                            </td>
                                        </Fragment>
                                    ) : (
                                        <Fragment key={`e-${j}`}>
                                            <td className="calculator-td" />
                                            <td className="calculator-td" />
                                            <td className="calculator-td" />
                                        </Fragment>
                                    )
                                )}
                                <td className="calculator-td">
                                    {r.avgTime != null ? formatTime(r.avgTime) : ''}
                                </td>
                                <td className="calculator-td">
                                    {r.avgPercent != null
                                        ? `${r.avgPercent.toFixed(2)}%`
                                        : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                type="button"
                className="calculator-btn calculator-btn-export"
                onClick={onExport}
            >
                Экспорт в Excel
            </button>
        </div>
    );
}
