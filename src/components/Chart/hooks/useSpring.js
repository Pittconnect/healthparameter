import { useCallback, useEffect, useMemo, useRef } from "react";

import { Spring } from "../utils/spring";
import { useGetLatest } from "./useGetLatest";

export const useSpring = (value, config, cb, immediate, debug) => {
  const springRef = useRef(new Spring(value, ...config));
  const getValue = useGetLatest(value);

  const [startRaf, stopRaf] = useRaf(() => {
    cb(springRef.current.x());
    return springRef.current.done();
  });

  useEffect(() => {
    if (immediate) {
      springRef.current.snap(getValue());
      startRaf();
      return;
    }
    springRef.current.setEnd(value);
    startRaf();
  }, [debug, getValue, immediate, startRaf, stopRaf, value]);

  useEffect(() => {
    return () => {
      stopRaf();
    };
  }, [stopRaf]);

  return springRef.current;
};

export const useRaf = (callback) => {
  const raf = useRef(null);
  const rafCallback = useRef(callback);
  rafCallback.current = callback;
  const tick = useCallback(() => {
    if (rafCallback.current()) return;
    raf.current = requestAnimationFrame(tick);
  }, []);

  return [
    useMemo(() => tick, [tick]),
    useMemo(() => () => raf.current && cancelAnimationFrame(raf.current), []),
  ];
};
