import { useHuddleStore } from "@huddle01/huddle01-client/store";
import React, { useEffect, useRef, useState } from "react";
import { Context } from "../App";
import styles from "../styles/Main.module.css";
import Canvas from "./Canvas";
import OtherVideo from "./OtherVideo";
import SelfVideo from "./SelfVideo";

const Main = () => {
  const wsRef = React.useContext(Context).wsRef;
  const clientRef = React.useContext(Context).clientRef;
  const gameRef = React.useContext(Context).gameRef;
  const clients = React.useContext(Context).clients;
  const socketState = React.useContext(Context).socketState;
  const activeClient = React.useContext(Context).activeClient;
  const providedWords = React.useContext(Context).providedWords;
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const timer = useRef<any>();

  const [time, setTime] = useState(60);
  const [choosedWord, setChoosedWord] = useState<any>("");

  const startPoint = (offset: any) => {
    let payLoad = {
      method: "startPoint",
      clientId: clientRef.current,
      offset: offset,
      gameId: gameRef.current,
    };
    wsRef.current.send(JSON.stringify(payLoad));
  };

  const closePoint = () => {
    let payLoad = {
      method: "closePoint",
      clientId: clientRef.current,
      gameId: gameRef.current,
    };
    wsRef.current.send(JSON.stringify(payLoad));
  };

  const updateGame = (color: any, offset: any) => {
    let payLoad = {
      method: "update",
      clientId: clientRef.current,
      color: color,
      offset: offset,
      gameId: gameRef.current,
    };
    wsRef.current.send(JSON.stringify(payLoad));
  };

  useEffect(() => {
    if (activeClient) {
      setTime(60);
      setChoosedWord("");
      clearInterval(timer.current);
      timer.current = setInterval(() => {
        setTime((curr) => {
          return curr - 1;
        });
      }, 1000);
    }
  }, [activeClient]);

  useEffect(() => {
    if (time <= 0) {
      clearInterval(timer.current);
      let payLoad = {
        method: "allotChance",
        gameId: gameRef.current,
      };
      activeClient == clientRef.current &&
        wsRef.current.send(JSON.stringify(payLoad));
    }
  }, [time]);

  useEffect(() => {
    // if (!gameRef.current) navigate("/");
  }, []);

  const checkAnswer = (event: any) => {
    if (event.key === "Enter") {
      if (choosedWord <= 0) return;
      let payLoad = {
        method: "checkAnswer",
        gameId: gameRef.current,
        answer: choosedWord,
        clientId: clientRef.current,
      };
      setChoosedWord("");
      wsRef.current.send(JSON.stringify(payLoad));
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.time}>{time}</div>
        {activeClient == clientRef.current ? (
          <div className={styles.time}>{choosedWord ? choosedWord : ""}</div>
        ) : (
          <input
            className={styles.inputBox}
            type="text"
            value={choosedWord}
            onChange={(e) => setChoosedWord(e.target.value)}
            onKeyDown={checkAnswer}
          />
        )}
      </div>
      <div className={styles.mainCanvasContainer}>
        <div className={styles.scoreContainer}>
          {clients &&
            clients.map((item: any, index: number) => {
              return (
                <div key={index} className={styles.scoreBox} style={{}}>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.score}>{item.score}</div>
                </div>
              );
            })}
        </div>
        <div className={styles.mainCanvas}>
          {!choosedWord && activeClient == clientRef.current ? (
            <div className={styles.wordChooseContainer}>
              {providedWords.map((item, index) => {
                return (
                  <div
                    className={styles.wordBox}
                    key={index}
                    onClick={() => {
                      const payLoad = {
                        method: "changeAnswer",
                        answer: item,
                        gameId: gameRef.current,
                      };
                      wsRef.current.send(JSON.stringify(payLoad));
                      setChoosedWord(item);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          ) : (
            <Canvas
              updateGame={updateGame}
              socketState={socketState}
              closePoint={closePoint}
              startPoint={startPoint}
            />
          )}
        </div>
        <div className={styles.mainVideoList}>
          <div className={styles.selfVideo}>
            <SelfVideo />
          </div>
          {peersKeys.map((key) => (
            <div className={styles.mainVideo} key={key}>
              <OtherVideo key={`peerId-${key}`} peerIdAtIndex={key} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;

// const wsRef = useRef<any>(null);
//   const clientRef = useRef<any>(null);
//   const gameRef = useRef<any>(null);

//   const [gameId, setGameId] = useState("");
//   const [socketState, setSocketState] = useState<any>(null);

//   const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
//   const huddleClient = getHuddleClient(
//     "01b67548084dd69992b28729550930f903f1233b480efbf7da811b7bbad44a20"
//   );

//   const handleJoin = async () => {
//     try {
//       await huddleClient.join("abc", {
//         address: "0x15900c698ee356E6976e5645394F027F0704c8Eb",
//         wallet: "",
//         ens: "axit.eth",
//       });

//       console.log("joined");
//     } catch (error) {
//       console.log({ error });
//     }
//   };

//   useEffect(() => {
//     handleJoin();
//     let ws = new WebSocket("ws://localhost:9090");
//     ws.onmessage = (message) => {
//       const response = JSON.parse(message.data);
//       if (response.method == "connect") {
//         clientRef.current = response.clientId;
//         // console.log("Client id set successfully ", clientRef.current);
//       }
//       if (response.method == "create") {
//         gameRef.current = response.game.id;
//         setGameId(response.game.id);
//         console.log("Game successfully created", response.game.id);
//       }
//       if (response.method == "join") {
//         gameRef.current = response.game.id;
//         // console.log("Game joined successfully", response.game.id);
//       }
//       if (response.method == "update") {
//         setSocketState(response);
//       }
//       if (response.method == "startPoint") {
//         setSocketState(response);
//       }
//       if (response.method == "closePoint") {
//         setSocketState(response);
//       }
//     };

//     wsRef.current = ws;
//   }, []);

//   const createGame = () => {
//     console.log("CREATE GAME");
//     let payload = {
//       method: "create",
//       clientId: clientRef.current,
//     };
//     wsRef.current.send(JSON.stringify(payload));
//   };

//   const joinGame = () => {
//     console.log("JOIN GAME");
//     if (!gameRef.current) gameRef.current = gameId;
//     let payload = {
//       method: "join",
//       clientId: clientRef.current,
//       gameId: gameRef.current,
//     };
//     wsRef.current.send(JSON.stringify(payload));
//   };

//   const startPoint = (offset: any) => {
//     let payLoad = {
//       method: "startPoint",
//       clientId: clientRef.current,
//       offset: offset,
//       gameId: gameRef.current,
//     };
//     wsRef.current.send(JSON.stringify(payLoad));
//   };

//   const closePoint = () => {
//     let payLoad = {
//       method: "closePoint",
//       clientId: clientRef.current,
//       gameId: gameRef.current,
//     };
//     wsRef.current.send(JSON.stringify(payLoad));
//   };

//   const updateGame = (color: any, offset: any) => {
//     let payLoad = {
//       method: "update",
//       clientId: clientRef.current,
//       color: color,
//       offset: offset,
//       gameId: gameRef.current,
//     };
//     wsRef.current.send(JSON.stringify(payLoad));
//   };

{
  /* <div className="mainCanvasElement">
          <button onClick={createGame}>CREATE GAME</button>
          <button onClick={joinGame}>JOIN GAME</button>
          <label>
            GameID:
            <input
              type="text"
              name="name"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />
          </label>
        </div> */
}
