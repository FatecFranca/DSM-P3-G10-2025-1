import React from "react";
import styles from "./Input.module.css"; // usa o mesmo CSS do Input

const Textarea = ({ label, name, value, onChange, error, onBlur, ...props }) => {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className={styles.input}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={5}
        {...props}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Textarea;