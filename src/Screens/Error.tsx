import { useLocation } from "react-router-dom";
import styles from "../styles/Error.module.css";

const Error = () => {
  const { state } = useLocation();

  const redirectHome = () => {
    window.location.replace("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainTitle}>
        {state?.error ? state?.error : "Connection Lost"}
      </div>
      <div className={styles.secondTitle}>
        {state?.message
          ? state?.message
          : "Looks like you have lost connection with wifi or other internet connection."}
      </div>
      <div className={styles.btn} onClick={redirectHome}>
        back to homepage
      </div>
    </div>
  );
};

export default Error;
