import { useCallback, useLayoutEffect, useRef, useState } from "react";

// const noop = () => {};

// const isBrowser = typeof window !== "undefined";

export const useLocalStorage = (key, initialValue, options) => {
  // if (!isBrowser) {
  //   return [initialValue, noop, noop];
  // }
  if (!key) {
    throw new Error("useLocalStorage key may not be falsy");
  }

  const deserializer = options
    ? options.raw
      ? (value) => value
      : options.deserializer
    : JSON.parse;

  const initializer = useRef((key) => {
    try {
      const serializer = options
        ? options.raw
          ? String
          : options.serializer
        : JSON.stringify;

      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue !== null) {
        return deserializer(localStorageValue);
      } else {
        initialValue && localStorage.setItem(key, serializer(initialValue));
        return initialValue;
      }
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });

  const [state, setState] = useState(() => initializer.current(key));

  useLayoutEffect(() => setState(initializer.current(key)), [key]);

  const set = useCallback(
    (valOrFunc) => {
      try {
        const newState =
          typeof valOrFunc === "function" ? valOrFunc(state) : valOrFunc;
        if (typeof newState === "undefined") return;
        let value;

        if (options)
          if (options.raw)
            if (typeof newState === "string") value = newState;
            else value = JSON.stringify(newState);
          else if (options.serializer) value = options.serializer(newState);
          else value = JSON.stringify(newState);
        else value = JSON.stringify(newState);

        localStorage.setItem(key, value);
        setState(deserializer(value));
      } catch {
        // If user is in private mode or has storage restriction
        // localStorage can throw. Also JSON.stringify can throw.
      }
    },
    [key, setState, deserializer, options, state]
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setState(undefined);
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw.
    }
  }, [key, setState]);

  return [state, set, remove];
};
