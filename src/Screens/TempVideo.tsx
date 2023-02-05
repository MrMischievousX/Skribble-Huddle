import { useEffect, useRef } from "react";
import styles from "../styles/Homepage.module.css";

const TempVideo = () => {
  const videoRef = useRef<any>(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: window.innerWidth * 0.32,
          height: window.innerHeight * 0.36,
        },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div className={styles.user}>
      <video className={styles.userVideo} ref={videoRef} />
    </div>
  );
};

export default TempVideo;
