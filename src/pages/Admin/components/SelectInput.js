import React from "react";
import clsx from "clsx";

const Select = ({ value, options, onChange, classes, ...selectProps }) => (
  <div className={clsx("form__select", { [classes]: classes })}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...selectProps}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
