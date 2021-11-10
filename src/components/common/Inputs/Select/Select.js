import React from "react";

const Select = ({ options, ...selectProps }) => (
  <div className="form__select">
    <select {...selectProps}>
      <option hidden />
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
