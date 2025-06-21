import React from "react";
import styles from "./Select.module.css";

const Select = ({ options, value, setValue, ...props }) => {
  return (
    <select
      className={`${styles.select} ${props.className}`}
      value={value}
      onChange={({ target }) => setValue(target.value)}
      {...props}
    >
      <option value="" disabled>
        Selecione
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;

