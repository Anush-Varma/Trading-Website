import styles from "../styles/button.module.css";

function Button(props) {
  return (
    <button
      className={styles.button}
      onClick={props.onClick}
      disabled={props.disabled}
      {...props}
    >
      {props.text}
    </button>
  );
}

export default Button;
