import React from 'react';
import { formatTime } from '../utils';

export function ResultsTable({ results, maxSegments, styles }) {
    const tokens = styles._tokens;
    return (
        <div
            style={{
                overflowX: 'auto',
                borderRadius: 12,
                border: `1px solid ${tokens?.colors?.border ?? 'rgba(0,0,0,0.08)'}`,
            }}
        >
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={{ ...styles.th, position: 'sticky', top: 0, zIndex: 1 }}>
                            Имя
                        </th>
                        <th style={{ ...styles.th, position: 'sticky', top: 0, zIndex: 1 }}>
                            Категория
                        </th>
                        <th style={{ ...styles.th, position: 'sticky', top: 0, zIndex: 1 }}>
                            Класс лодки
                        </th>
                        {Array.from({ length: maxSegments }).map((_, i) => [
                            <th
                                key={`d${i}`}
                                style={{
                                    ...styles.th,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >{`Дистанция${i + 1}`}</th>,
                            <th
                                key={`t${i}`}
                                style={{
                                    ...styles.th,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >{`Время${i + 1}`}</th>,
                            <th
                                key={`p${i}`}
                                style={{
                                    ...styles.th,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >{`Модель${i + 1}`}</th>,
                        ])}
                        <th style={{ ...styles.th, position: 'sticky', top: 0, zIndex: 1 }}>
                            Среднее время
                        </th>
                        <th style={{ ...styles.th, position: 'sticky', top: 0, zIndex: 1 }}>
                            Средняя модель
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((r, i) => (
                        <tr
                            key={i}
                            style={{
                                background:
                                    i % 2 === 0
                                        ? 'transparent'
                                        : tokens?.colors?.surface2 ?? 'rgba(0,0,0,0.02)',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    tokens?.colors?.surface2 ?? 'rgba(0,0,0,0.04)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    i % 2 === 0
                                        ? 'transparent'
                                        : tokens?.colors?.surface2 ?? 'rgba(0,0,0,0.02)';
                            }}
                        >
                            <td style={styles.td}>{r.name}</td>
                            <td style={styles.td}>{r.category}</td>
                            <td style={styles.td}>{r.boat}</td>
                            {Array.from({ length: maxSegments }).map((_, j) =>
                                r.segs[j]
                                    ? [
                                          <td key={`d${j}`} style={styles.td}>
                                              <span style={styles.number}>
                                                  {r.segs[j].distance}
                                              </span>
                                          </td>,
                                          <td key={`t${j}`} style={styles.td}>
                                              <span style={styles.number}>{r.segs[j].time}</span>
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
                                {r.avgPercent != null ? (
                                    <span style={styles.number}>
                                        {`${r.avgPercent.toFixed(2)}%`}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

