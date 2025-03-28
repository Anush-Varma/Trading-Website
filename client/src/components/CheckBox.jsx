import React, { useState } from "react";
import styles from "../styles/checkBox.module.css";

function CheckBox({ label, onChange, disabled = false }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBox = () => {
    if (!disabled) {
      const newCheckedState = !isChecked;
      setIsChecked(newCheckedState);

      if (onChange) {
        onChange({ target: { checked: newCheckedState } });
      }
    }
  };

  return (
    <label className={styles.checkboxContainer}>
      <input
        type="checkbox"
        className={styles.hiddenCheckBox}
        checked={isChecked}
        onChange={handleCheckBox}
        disabled={disabled}
        hidden={true}
      />
      <span
        className={`${styles.styledCheckbox} ${
          isChecked ? styles.checked : ""
        } ${disabled ? styles.disabled : ""}`}
      ></span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}

export default CheckBox;
