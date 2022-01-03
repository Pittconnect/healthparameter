import { useRef } from "react";

export const useLatestWhen = (obj, when = true) => {
  const ref = useRef(when ? obj : null);

  if (when) {
    ref.current = obj;
  }

  return ref.current;
};
