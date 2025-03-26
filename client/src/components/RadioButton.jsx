import React, { useState } from "react";
import styles from "../styles/radioButton.module.css";

function RadioButton({ text, name, value, checked, onChange }) {
  return (
    <label className={styles.radioLabel}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span>{text}</span>
    </label>
  );
}

export default RadioButton;
