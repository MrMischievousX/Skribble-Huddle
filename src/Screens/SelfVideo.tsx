import { useHuddleStore } from "@huddle01/huddle01-client/store";
import React, { useEffect, useRef, useState } from "react";
import { Context } from "../App";
import styles from "../styles/Video.module.css";
import { camera, cameraOff, mute, speaker } from "./assets";

const SelfVideo = () => {
  const stream = useHuddleStore((state) => state.stream);
  const isCamPaused = useHuddleStore((state) => state.isCamPaused);
  const isMicPaused = useHuddleStore((state) => state.isMicPaused);
  const huddleClient = React.useContext(Context).huddleClient;

  const [camEnabled, setcamEnabled] = useState(isCamPaused);
  const [micEnabled, setmicEnabled] = useState(isMicPaused);

  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const webcam = () => {
    if (camEnabled) {
      huddleClient.disableWebcam();
      setcamEnabled(false);
    } else {
      setcamEnabled(true);
      huddleClient.enableWebcam();
    }
  };

  const mic = () => {
    if (micEnabled) {
      huddleClient.disableMic();
      setmicEnabled(false);
    } else {
      setmicEnabled(true);
      huddleClient.enableMic();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        transform: "rotateY(180deg)",
      }}
    >
      {/* <div className={styles.controlBtn1} onClick={webcam}>
        <img
          src={camEnabled ? camera : cameraOff}
          alt=""
          width={32}
          height={32}
        />
      </div>
      <div className={styles.controlBtn2} onClick={mic}>
        <img src={micEnabled ? speaker : mute} alt="" width={32} height={32} />
      </div> */}
      <video
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          objectFit: "cover",
        }}
        ref={videoRef}
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default SelfVideo;
