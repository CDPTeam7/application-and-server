import { css } from "@linaria/core";
import { Button } from "@mui/material";
import CameraIcon from "@mui/icons-material/Camera";
import UploadIcon from "@mui/icons-material/Upload";
import { ThemeSheet } from "@/theme/ThemeSheet";
import { SignUpStep } from "@/pages/Signup";

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
}

export default function FaceForm(props: FaceFormProps) {
  // 카메라로 사진을 받아오기
  const handleButtonClick = (_e: any) => {
    props.setStep(1);
  };
  return (
    <>
      <div style={{ marginBottom: "2rem" }}>회수기 얼굴 인식을 위해 얼굴 등록이 필요해요.</div>
      <Button className={uploadBarStyle}>
        <CameraIcon />
        <span>카메라 촬영하기</span>
      </Button>
      <Button className={uploadBarStyle} onClick={handleButtonClick}>
        <UploadIcon />
        <span>인식 가능한 얼굴 업로드</span>
      </Button>
      <div className={buttonStyle}>
        <Button variant="contained" disabled>
          얼굴 등록이 필요해요.
        </Button>
      </div>
    </>
  );
}
