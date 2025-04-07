import React, { useState, useEffect } from "react";
import styles from "../styles/checkBox.module.css";
import { useCallback } from "react";

function CheckBox({
  label,
  onChange,
  disabled = false,
  initialChecked = false,
}) {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleCheckBox = useCallback(() => {
    if (!disabled) {
      const newCheckedState = !isChecked;
      setIsChecked(newCheckedState);

      if (onChange) {
        onChange({ target: { checked: newCheckedState } });
      }
    }
  }, [isChecked, onChange, disabled]);

  useEffect(() => {
    if (isChecked !== initialChecked) {
      setIsChecked(initialChecked);
    }
  }, [initialChecked, isChecked]);

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

export default React.memo(CheckBox);
