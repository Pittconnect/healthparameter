import React, { useCallback, useMemo } from "react";
import clsx from "clsx";

const AuthContainerInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onToggle,
}) => {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value.trim());
    },
    [onChange]
  );

  const inputProps = useMemo(
    () => ({
      ...(onToggle
        ? { checked: value, onChange: onToggle }
        : { value, onChange: handleChange }),
    }),
    [onToggle, value, handleChange]
  );

  return (
    <div
      className={`uk-flex uk-flex-column ${
        type === "checkbox" ? "modal__checkbox" : "form__row"
      }`}
    >
      <input
        id={id}
        name={id}
        className="form__input"
        type={type}
        {...inputProps}
      />
      <label
        className={clsx({
          "form__label uk-flex-first": type !== "checkbox",
        })}
        htmlFor={id}
      >
        {label}
      </label>
      <span className="form__row-border" />
    </div>
  );
};

export default AuthContainerInput;
