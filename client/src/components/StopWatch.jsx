import React, { useState, useEffect } from "react";
import styles from "../styles/stopWatch.module.css";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const StopWatch = ({ autoStart = false, onStateChange = () => {} }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    onStateChange(isRunning);
  }, [isRunning, onStateChange]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.stopWatchContainer}>
      <div className={styles.stopWatchDisplay}>
        <span className={styles.time}>{formatTime(time)}</span>
        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={toggleRunning}>
            {isRunning ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopWatch;
