import { useState, useEffect } from 'react';

export default function useTypewriter(words, speed = 150, pause = 1000) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [text, setText] = useState('');

    useEffect(() => {
        if (index >= words.length) {
            setIndex(0);
            return;
        }

        if (subIndex === words[index].length + 1 && !reverse) {
            setReverse(true);
            return;
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setText(words[index].substring(0, subIndex));
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? speed / 2 : subIndex === words[index].length ? pause : speed);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words, speed, pause]);

    return text;
}
