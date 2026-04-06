import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
    const getMatches = () => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    };

    const [matches, setMatches] = useState(getMatches);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia(query);

        const handler = (e) => setMatches(e.matches);
        mql.addEventListener('change', handler);
        setMatches(mql.matches);

        return () => mql.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

