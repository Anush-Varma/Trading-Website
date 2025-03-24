import styles from "../styles/input.module.css";

function Input(props) {
  return <input className={styles.input} {...props}></input>;
}

export default Input;
