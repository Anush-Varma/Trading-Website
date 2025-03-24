import styles from "../styles/Button.module.css";

function Button(props) {
  return (
    <button className={styles.button} onClick={props.onClick} {...props}>
      {props.text}
    </button>
  );
}

export default Button;
