import { useState } from "react";

export const useOpen = (state = false) => {
  const [open, setOpen] = useState(state);

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!open),
    opened: open,
  };
};
