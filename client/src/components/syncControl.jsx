import React from "react";
import CheckBox from "./CheckBox";
import { useSync } from "../context/SyncContext";
import styles from "../styles/SyncControl.module.css";
import { useCallback } from "react";

function SyncControl() {
  const { isSynced, toggleSync } = useSync();

  const handleSyncChange = useCallback(
    (e) => {
      toggleSync(e.target.checked);
    },
    [toggleSync]
  );

  return (
    <div className={styles.syncControl}>
      <CheckBox
        label="Sync Technical Indicators"
        onChange={handleSyncChange}
        initialChecked={isSynced}
        disabled={false}
      />
    </div>
  );
}

export default React.memo(SyncControl);
