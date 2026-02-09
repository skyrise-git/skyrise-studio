"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const CHARS = '█▓▒░<*/>$#?&';

type DecryptTextProps = {
  text: string;
  className?: string;
  as?: React.ElementType;
};

const DecryptText: React.FC<DecryptTextProps> = ({ text, className, as: Tag = 'span' }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDecrypting = useRef(false);

  const scramble = useCallback(() => {
    if (isDecrypting.current) return;
    isDecrypting.current = true;
    let iteration = 0;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((_char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (_char === ' ') return ' ';
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        isDecrypting.current = false;
      }

      iteration += 1 / 2;
    }, 30);
  }, [text]);
  
  const reset = useCallback(() => {
    if (isDecrypting.current) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Tag
      onMouseEnter={scramble}
      onMouseLeave={reset}
      className={cn("font-body", className)}
    >
      {displayText}
    </Tag>
  );
};

export default DecryptText;
