import { useHuddleStore } from "@huddle01/huddle01-client/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Context } from "../App";
import styles from "../styles/Video.module.css";
import { camera, mute } from "./assets";

const OtherVideo = ({ peerIdAtIndex }: { peerIdAtIndex: any }) => {
  const videoRef = useRef<any>(null);
  const audioRef = useRef<any>(null);
  const huddleClient = React.useContext(Context).huddleClient;
  const [isWebCam, setisWebCam] = useState(false);
  const [isMic, setIsMic] = useState(true);

  const peerCamTrack = useHuddleStore(
    useCallback(
      (state) => state.peers[peerIdAtIndex]?.consumers?.cam,
      [peerIdAtIndex]
    )
  )?.track;

  const peerMicTrack = useHuddleStore(
    useCallback(
      (state) => state.peers[peerIdAtIndex]?.consumers?.mic,
      [peerIdAtIndex]
    )
  )?.track;

  const getStream = (_track: any) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

  const webcam = () => {
    if (isWebCam) {
      huddleClient.disableWebcam();
    } else huddleClient.enableWebcam();
  };

  const mic = () => {
    if (isMic) {
      huddleClient.disableMic();
    } else huddleClient.enableMic();
  };

  useEffect(() => {
    const videoObj = videoRef.current;

    if (videoObj && peerCamTrack) {
      videoObj.load();
      videoObj.srcObject = getStream(peerCamTrack);
      videoObj.play().catch((err: any) => {
        console.log({
          message: "Error playing video",
          meta: {
            err,
          },
        });
      });
    }

    return () => {
      if (videoObj) {
        videoObj?.pause();
        videoObj.srcObject = null;
      }
    };
  }, [peerCamTrack]);

  useEffect(() => {
    if (peerMicTrack && audioRef.current) {
      audioRef.current.srcObject = getStream(peerMicTrack);
    }
  }, [peerMicTrack]);

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
        <img src={camera} alt="" width={40} height={40} />
      </div>
      <div className={styles.controlBtn2} onClick={mic}>
        <img src={mute} alt="" width={40} height={40} />
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

{
  /* <audio ref={audioRef} autoPlay playsInline controls={false}></audio> */
}
export default React.memo(OtherVideo);
