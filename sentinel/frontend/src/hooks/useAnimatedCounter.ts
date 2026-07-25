"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(
  value: number,
  formatOptions: Intl.NumberFormatOptions = {}
) {
  const [displayValue, setDisplayValue] = useState("");
  const prevValue = useRef(value);

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate(v) {
        setDisplayValue(new Intl.NumberFormat("en-US", formatOptions).format(v));
      },
      onComplete() {
        prevValue.current = value;
      }
    });

    return () => controls.stop();
  }, [value, formatOptions]);

  // Initial render
  useEffect(() => {
    setDisplayValue(new Intl.NumberFormat("en-US", formatOptions).format(value));
  }, []);

  return displayValue;
}
