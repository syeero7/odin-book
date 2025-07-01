import styles from "./Fallback.module.css";

function Fallback() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  );
}

export default Fallback;
