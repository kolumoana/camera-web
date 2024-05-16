"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Center, Group, Space, Stack, Switch } from "@mantine/core";

export const Camera = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isVertical, setIsVertical] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const constraints = {
      video: { facingMode: "environment" },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const drawToCanvas = () => {
      if (videoRef.current && displayCanvasRef.current) {
        const context = displayCanvasRef.current.getContext("2d");
        if (context) {
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;

          const aspectRatio = isVertical ? 9 / 16 : 16 / 9;
          let drawWidth, drawHeight;

          if (isVertical) {
            drawHeight = videoHeight;
            drawWidth = videoHeight * aspectRatio;
          } else {
            drawWidth = videoWidth;
            drawHeight = videoWidth / aspectRatio;
          }

          const offsetX = (videoWidth - drawWidth) / 2;
          const offsetY = (videoHeight - drawHeight) / 2;

          displayCanvasRef.current.width = isVertical ? 270 : 480;
          displayCanvasRef.current.height = isVertical ? 480 : 270;

          context.drawImage(
            videoRef.current,
            offsetX,
            offsetY,
            drawWidth,
            drawHeight,
            0,
            0,
            displayCanvasRef.current.width,
            displayCanvasRef.current.height
          );
        }
      }
    };

    drawToCanvas();

    const interval = setInterval(drawToCanvas, 5);

    return () => clearInterval(interval);
  }, [isVertical]);

  const handleCapture = () => {
    if (canvasRef.current && displayCanvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = displayCanvasRef.current.width;
        canvasRef.current.height = displayCanvasRef.current.height;
        context.drawImage(
          displayCanvasRef.current,
          0,
          0,
          displayCanvasRef.current.width,
          displayCanvasRef.current.height
        );
        setImageSrc(canvasRef.current.toDataURL("image/png"));
      }
    }
  };

  const handleClear = () => {
    setImageSrc(null);
    setIsVertical(true);
  };

  const toggleFrameOrientation = () => {
    setImageSrc(null);
    setIsVertical(!isVertical);
  };

  const getFrameStyles = () => ({
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  });

  const containerStyles = {
    width: isVertical ? "50vw" : "90vw",
    maxWidth: isVertical ? "270px" : "480px",
    height: isVertical ? "90vw" : "50vw",
    maxHeight: isVertical ? "480px" : "270px",
    position: "relative" as const,
    overflow: "hidden",
    margin: "0 auto",
  };

  return (
    <div>
      <Center>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={containerStyles}>
            <canvas ref={displayCanvasRef} style={getFrameStyles()} />
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Captured"
                style={{
                  ...getFrameStyles(),
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            )}
          </div>
          <Space h="xs" />
          <Group>
            <Button onClick={handleCapture}>撮影</Button>
            <Space h="xs" />
            <Switch
              onChange={toggleFrameOrientation}
              checked={isVertical}
              label="縦/横切替"
            />
            <Button onClick={handleClear}>クリア</Button>
          </Group>
        </div>
        <video
          ref={videoRef}
          style={{ display: "none" }}
          playsInline
          autoPlay
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </Center>
    </div>
  );
};
