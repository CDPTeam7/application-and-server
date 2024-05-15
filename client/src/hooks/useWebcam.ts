// 캔버스 객체를 관리

import { requestSetImage } from "@/api";
import { useRef } from "react";
import Webcam from "react-webcam";

// api call 을 날림

export const useWebcam = () => {
  const webcamRef = useRef<Webcam>(null);
  const setImage = () => {
    if (webcamRef.current === null) return;
    const file = base64ToFile(webcamRef.current.getScreenshot(), "recognition.png");
    console.log(file);
    requestSetImage(file);
  };

  return {
    webcamRef,
    setImage,
  };
};

function base64ToFile(baseData: any, filename: string) {
  if (!baseData) {
    throw Error("failed to capture image");
    return;
  }
  if (!baseData || baseData === "data:,") return null;
  let mime = baseData.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
  const base64 = baseData.replace(/^data:.+;base64,/, "");
  // Base64 문자열을 ArrayBuffer로 변환
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // ArrayBuffer를 Blob으로 변환
  const blob = new Blob([byteArray], { type: mime });

  // Blob을 File 객체로 변환
  const file = new File([blob], filename, { type: mime });

  return file;
}
