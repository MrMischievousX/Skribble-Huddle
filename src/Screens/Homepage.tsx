import React, { useState } from "react";
import { Context } from "../App";
import styles from "../styles/Homepage.module.css";
import { useParams } from "react-router-dom";
import TempVideo from "./TempVideo";
import { createRoom, joinRoom } from "../utils/SocketHelpers";

const Homepage = ({ isJoin = false }: { isJoin?: boolean }) => {
  const wsRef = React.useContext(Context).wsRef;
  const clientRef = React.useContext(Context).clientRef;
  const name = React.useContext(Context).name;

  const [userName, setUserName] = useState(name.current);

  const params = useParams();

  return (
    <div className={styles.container}>
      <img src="https://skribbl.io/img/logo.gif" className={styles.logo} />
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.input}
          value={userName}
          placeholder="Enter your name"
          onChange={(e) => setUserName(e.target.value)}
        />
        <TempVideo />
        {!isJoin ? (
          <button
            className={styles.start}
            style={{ backgroundColor: "#53e237" }}
            onClick={() => createRoom(userName, name, wsRef, clientRef)}
          >
            Start
          </button>
        ) : (
          <button
            className={styles.start}
            style={{ backgroundColor: "#2c8de7" }}
            onClick={() => joinRoom(userName, params, wsRef, clientRef)}
          >
            Join
          </button>
        )}
      </div>
    </div>
  );
};

export default Homepage;
