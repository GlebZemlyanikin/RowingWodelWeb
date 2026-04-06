import React from 'react';

function shortSha(sha) {
    if (!sha) return '';
    return sha.slice(0, 7);
}

export function BuildInfo({ theme }) {
    const version = import.meta.env.VITE_APP_VERSION || '0.0.0';
    const sha = import.meta.env.VITE_GIT_SHA || '';
    const mode = import.meta.env.MODE;
    const buildId = import.meta.env.VITE_BUILD_TIME || '';

    const fg = theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(42,59,93,0.65)';
    const border = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(42,59,93,0.12)';

    return (
        <div
            style={{
                marginTop: 18,
                paddingTop: 12,
                borderTop: `1px solid ${border}`,
                fontSize: 12,
                color: fg,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
            }}
            aria-label="Build information"
        >
            <span>
                Version: <strong style={{ color: fg }}>{version}</strong>
                {sha ? (
                    <>
                        {' '}
                        · commit{' '}
                        <strong style={{ color: fg, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                            {shortSha(sha)}
                        </strong>
                    </>
                ) : null}
            </span>
            <span>
                Env: <strong style={{ color: fg }}>{mode}</strong>
                {buildId ? (
                    <>
                        {' '}
                        · build <strong style={{ color: fg }}>{buildId}</strong>
                    </>
                ) : null}
            </span>
        </div>
    );
}

