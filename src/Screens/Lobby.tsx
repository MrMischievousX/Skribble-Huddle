import { useHuddleStore } from "@huddle01/huddle01-client/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import styles from "../styles/Lobby.module.css";
import OtherVideo from "./OtherVideo";
import SelfVideo from "./SelfVideo";

const Lobby = () => {
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const gameRef = React.useContext(Context).gameRef;
  const creator = React.useContext(Context).creator;
  const huddleClient = React.useContext(Context).huddleClient;
  const wsRef = React.useContext(Context).wsRef;
  const navigate = useNavigate();

  const startGame = () => {
    let payLoad = {
      method: "start",
      gameId: gameRef.current,
    };
    wsRef.current.send(JSON.stringify(payLoad));
  };

  useEffect(() => {
    if (!gameRef.current) navigate("/");

    // try {
    //   huddleClient.join(gameRef.current, {
    //     address: process.env.REACT_APP_WALLET_ADDRESS || "",
    //     wallet: "",
    //     ens: "axit.eth",
    //   });

    //   console.log("joined");
    // } catch (error) {
    //   console.log({ error });
    // }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>LOBBY</div>
        {creator ? (
          <div className={styles.start} onClick={startGame}>
            START
          </div>
        ) : (
          <></>
        )}
      </div>
      <div>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <SelfVideo />
          </div>
          {peersKeys.slice(0, 8).map((key) => (
            <div className={styles.gridItem} key={key}>
              <OtherVideo key={`peerId-${key}`} peerIdAtIndex={key} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
