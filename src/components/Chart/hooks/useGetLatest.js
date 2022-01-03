import { useRef } from "react";

export const useGetLatest = (obj) => {
  const ref = useRef(obj);
  const getterRef = useRef();

  ref.current = obj;
  if (!getterRef.current) {
    getterRef.current = () => ref.current;
  }

  return getterRef.current;
};
