import React, { useRef } from "react";
import clsx from "clsx";

import { useOpen, useOutsideClick } from "../../../../hooks";

const Dropdown = ({ data, items }) => {
  const ref = useRef();
  const { opened, toggle, close } = useOpen();

  useOutsideClick({ ref, close });

  const onItemClick = (itemHandler) => {
    itemHandler(data);
    close();
  };

  return (
    <div className="dropdown-wrapper" ref={ref}>
      <span
        className="show-more show-more--ellipsis has-dropdown"
        data-dropdown="dropd1"
        onClick={toggle}
      />
      <nav
        className={clsx(
          "dropdown-menu dropdown-menu--content dropdown-menu--table",
          { active: opened }
        )}
      >
        <ul className="items">
          {items.map(({ title, handler }, idx) => (
            <li key={idx} onClick={() => onItemClick(handler)}>
              {title}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Dropdown;
