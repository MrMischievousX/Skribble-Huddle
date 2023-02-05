import React, { useEffect, useRef, useState } from "react";
import { Context } from "../App";

const Canvas = ({
  socketState,
  updateGame,
  closePoint,
  startPoint,
}: {
  socketState: any;
  updateGame: any;
  closePoint: any;
  startPoint: any;
}) => {
  const canvasRef = useRef<any>(null);
  const contextRef = useRef<any>(null);

  const activeClient = React.useContext(Context).activeClient;
  const clientRef = React.useContext(Context).clientRef;

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("black");

  const startDrawing = ({ nativeEvent }: { nativeEvent: any }) => {
    const { offsetX, offsetY } = nativeEvent;
    startPoint({ offsetX, offsetY });
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    closePoint();
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: { nativeEvent: any }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const offset = { x: offsetX, y: offsetY };
    updateGame(currentColor, offset);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight * 0.8;
    canvas.style.width = `${window.innerWidth * 0.6}px`;
    canvas.style.height = `${window.innerHeight * 0.8}px`;
    const context = canvas.getContext("2d");
    context.strokeStyle = currentColor;
    context.lineWidth = 4;
    context.lineCap = "round";
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (activeClient)
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
  }, [activeClient]);

  useEffect(() => {
    if (socketState) {
      if (socketState.method == "update") {
        // console.log("UPDATED");
        contextRef.current.strokeStyle = socketState.color;
        contextRef.current.lineTo(socketState.offset.x, socketState.offset.y);
        contextRef.current.stroke();
      }
      if (socketState.method == "startPoint") {
        // console.log("STARTED");
        contextRef.current.beginPath();
        contextRef.current.moveTo(socketState.offset.x, socketState.offset.y);
      }
      if (socketState.method == "closePoint") {
        // console.log("ENDED");
        contextRef.current.closePath();
      }
    }
  }, [socketState]);

  return (
    <canvas
      onMouseDown={(e) => activeClient == clientRef.current && startDrawing(e)}
      onMouseUp={() => activeClient == clientRef.current && finishDrawing()}
      onMouseMove={(e) => activeClient == clientRef.current && draw(e)}
      ref={canvasRef}
      onDoubleClick={() => {
        if (currentColor == "white") {
          setCurrentColor("black");
          contextRef.current.strokeStyle = "black";
        } else {
          setCurrentColor("white");
          contextRef.current.strokeStyle = "white";
        }
      }}
      style={{ backgroundColor: "white" }}
    />
  );
};

export default Canvas;
