export function getStyles(theme) {
    const colors =
        theme === 'dark'
            ? {
                  bg1: '#1f2229',
                  bg2: '#2b303a',
                  card: '#23272f',
                  surface: '#2c2f36',
                  surface2: '#262a32',
                  text: '#ffffff',
                  textMuted: 'rgba(255,255,255,0.72)',
                  border: 'rgba(255,255,255,0.12)',
                  borderStrong: 'rgba(255,255,255,0.18)',
                  primary: '#4f8cff',
                  danger: '#ff4f4f',
              }
            : {
                  bg1: '#e0eafc',
                  bg2: '#cfdef3',
                  card: '#ffffff',
                  surface: '#f7fafd',
                  surface2: '#eff6ff',
                  text: '#1f2937',
                  textMuted: 'rgba(31,41,55,0.72)',
                  border: 'rgba(31,41,55,0.12)',
                  borderStrong: 'rgba(31,41,55,0.18)',
                  primary: '#4f8cff',
                  danger: '#ff4f4f',
              };

    const shadow = '0 10px 30px rgba(16, 24, 40, 0.12)';
    const shadowHover = '0 14px 40px rgba(16, 24, 40, 0.16)';
    const focusRing = `0 0 0 4px ${theme === 'dark' ? 'rgba(79,140,255,0.25)' : 'rgba(79,140,255,0.22)'}`;

    return {
        page: {
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            background:
                theme === 'dark'
                    ? 'linear-gradient(120deg, #171a20 0%, #2b303a 100%)'
                    : `linear-gradient(120deg, ${colors.bg1} 0%, ${colors.bg2} 100%)`,
            fontFamily: 'Segoe UI, Arial, sans-serif',
            lineHeight: 1.35,
            transition: 'background 0.3s',
        },
        card: {
            background: colors.card,
            boxShadow: shadow,
            border: `1px solid ${colors.border}`,
            borderRadius: 18,
            padding: 24,
            maxWidth: 1040,
            width: '100%',
            margin: '24px auto',
            transition: 'background 0.3s, box-shadow 0.2s, border 0.2s',
        },
        title: {
            textAlign: 'center',
            marginBottom: 18,
            fontSize: 26,
            letterSpacing: '-0.02em',
            color: theme === 'dark' ? '#fff' : '#2a3b5d',
        },
        subtitle: {
            margin: '0 0 10px 0',
            fontSize: 14,
            fontWeight: 600,
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
        },
        mutedText: {
            color: colors.textMuted,
        },
        section: {
            marginBottom: 24,
        },
        flexRow: {
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 12,
        },
        input: {
            padding: '8px 12px',
            border: `1px solid ${colors.borderStrong}`,
            borderRadius: 10,
            fontSize: 16,
            outline: 'none',
            transition:
                'border 0.2s, background 0.3s, color 0.3s, box-shadow 0.2s, transform 0.12s',
            background: colors.surface,
            color: colors.text,
        },
        select: {
            padding: '8px 12px',
            border: `1px solid ${colors.borderStrong}`,
            borderRadius: 10,
            fontSize: 16,
            background: colors.surface,
            color: colors.text,
            transition:
                'background 0.3s, color 0.3s, border 0.2s, box-shadow 0.2s, transform 0.12s',
        },
        button: {
            padding: '8px 20px',
            border: 'none',
            borderRadius: 10,
            background: colors.primary,
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px 0 rgba(34, 60, 80, 0.10)',
            marginRight: 8,
            marginTop: 4,
            marginBottom: 4,
            transition:
                'background 0.2s, box-shadow 0.2s, transform 0.12s, filter 0.2s, opacity 0.2s',
        },
        buttonDanger: {
            background: colors.danger,
            color: '#fff',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: 16,
            background: colors.surface,
            borderRadius: 12,
            overflow: 'hidden',
            color: colors.text,
            border: `1px solid ${colors.border}`,
            transition: 'background 0.3s, color 0.3s, border 0.2s',
        },
        th: {
            background: colors.surface2,
            padding: '10px 10px',
            borderBottom: `1px solid ${colors.border}`,
            fontWeight: 600,
            textAlign: 'center',
            color: colors.text,
            transition: 'background 0.3s, color 0.3s, border 0.2s',
        },
        td: {
            padding: '10px 10px',
            borderBottom: `1px solid ${colors.border}`,
            textAlign: 'center',
            fontSize: 15,
            color: colors.text,
            transition: 'background 0.2s, color 0.3s, border 0.2s',
        },
        number: {
            fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontVariantNumeric: 'tabular-nums',
        },
        segmentBlock: {
            background: theme === 'dark' ? colors.surface2 : colors.surface,
            borderRadius: 14,
            padding: 14,
            marginBottom: 8,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 1px 0 rgba(16,24,40,0.04)',
            transition: 'background 0.3s, border 0.2s, box-shadow 0.2s, transform 0.12s',
        },
        themeToggle: {
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 10,
            background: colors.surface2,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            padding: '8px 16px',
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 2px 8px 0 rgba(34, 60, 80, 0.10)',
            transition:
                'background 0.3s, color 0.3s, transform 0.12s, box-shadow 0.2s, border 0.2s',
        },
        _tokens: {
            colors,
            shadow,
            shadowHover,
            focusRing,
        },
    };
}

