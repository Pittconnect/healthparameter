import React from "react";
import clsx from "clsx";

const Select = ({
  value,
  options,
  placeholder,
  onChange,
  classes,
  ...selectProps
}) => (
  <div className={clsx("form__select", { [classes]: classes })}>
    <select value={value} onChange={onChange} {...selectProps}>
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
