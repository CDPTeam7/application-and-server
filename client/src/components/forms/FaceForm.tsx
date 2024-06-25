import { css } from "@linaria/core";
import { Button } from "@mui/material";
import CameraIcon from "@mui/icons-material/Camera";
// import UploadIcon from "@mui/icons-material/Upload";
import { ThemeSheet } from "@/theme/ThemeSheet";
import { SignUpStep } from "@/pages/Signup";
import { useRef, useState } from "react";
import CameraModal from "../common/CameraModal";
import Webcam from "react-webcam";

const buttonStyle = css`
  & button {
    color: white;
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  width: -webkit-fill-available;
  margin: 1rem 2rem;
  margin-top: 3rem;
`;

const uploadBarStyle = css`
  display: flex;
  width: -webkit-fill-available;
  margin: 1rem 2rem !important;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 16px;
  background-color: ${ThemeSheet.Branded[100]} !important;
  border: 1px solid ${ThemeSheet.Gray[200]} !important;
  height: 64px;
  & svg {
    color: ${ThemeSheet.Gray[700]};
    margin-right: 6px;
  }
  & span {
    color: ${ThemeSheet.Gray[600]};
  }
`;

interface FaceFormProps {
  setStep: React.Dispatch<SignUpStep>;
  saveImage: () => void;
  setImage: () => void;
  webcamRef: React.LegacyRef<Webcam>;
}

export default function FaceForm(props: FaceFormProps) {
  const { saveImage, setImage, webcamRef } = props;
  const [show, setShow] = useState<boolean>(false);
  const didUpload = useRef<boolean>(false);
  // 카메라로 사진을 받아오기
  const handleButtonClick = (_e: any) => {
    setShow(true);
  };
  return (
    <>
      <div style={{ marginBottom: "2rem" }}>회수기 얼굴 인식을 위해 얼굴 등록이 필요해요.</div>
      <Button className={uploadBarStyle} onClick={handleButtonClick}>
        <CameraIcon />
        <span>카메라 촬영하기</span>
      </Button>
      {/* <Button className={uploadBarStyle} onClick={handleButtonClick}>
        <UploadIcon />
        <span>인식 가능한 얼굴 업로드</span>
      </Button> */}
      <CameraModal
        isShow={show}
        setShow={setShow}
        clickEventHandler={() => {
          didUpload.current = true;
        }}
        transactionType={"save"}
        setImage={setImage}
        saveImage={saveImage}
        webcamRef={webcamRef}
      />
      <div
        className={buttonStyle}
        onClick={() => {
          if (didUpload.current) props.setStep(1);
        }}
      >
        <Button variant="contained" disabled={!didUpload.current}>
          {didUpload.current ? "다음" : "얼굴 등록이 필요해요."}
        </Button>
      </div>
    </>
  );
}
