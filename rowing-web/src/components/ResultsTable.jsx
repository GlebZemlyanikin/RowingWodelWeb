import React from 'react';
import { formatTime } from '../utils';

export function ResultsTable({ results, maxSegments, styles }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Имя</th>
                        <th style={styles.th}>Категория</th>
                        <th style={styles.th}>Класс лодки</th>
                        {Array.from({ length: maxSegments }).map((_, i) => [
                            <th key={`d${i}`} style={styles.th}>{`Дистанция${i + 1}`}</th>,
                            <th key={`t${i}`} style={styles.th}>{`Время${i + 1}`}</th>,
                            <th key={`p${i}`} style={styles.th}>{`Модель${i + 1}`}</th>,
                        ])}
                        <th style={styles.th}>Среднее время</th>
                        <th style={styles.th}>Средняя модель</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((r, i) => (
                        <tr key={i}>
                            <td style={styles.td}>{r.name}</td>
                            <td style={styles.td}>{r.category}</td>
                            <td style={styles.td}>{r.boat}</td>
                            {Array.from({ length: maxSegments }).map((_, j) =>
                                r.segs[j]
                                    ? [
                                          <td key={`d${j}`} style={styles.td}>
                                              {r.segs[j].distance}
                                          </td>,
                                          <td key={`t${j}`} style={styles.td}>
                                              {r.segs[j].time}
                                          </td>,
                                          <td key={`p${j}`} style={styles.td}>
                                              {r.segs[j].percent != null
                                                  ? `${r.segs[j].percent.toFixed(2)}%`
                                                  : ''}
                                          </td>,
                                      ]
                                    : [
                                          <td key={`d${j}`} style={styles.td}></td>,
                                          <td key={`t${j}`} style={styles.td}></td>,
                                          <td key={`p${j}`} style={styles.td}></td>,
                                      ]
                            )}
                            <td style={styles.td}>
                                {r.avgTime != null ? formatTime(r.avgTime) : ''}
                            </td>
                            <td style={styles.td}>
                                {r.avgPercent != null ? `${r.avgPercent.toFixed(2)}%` : ''}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

