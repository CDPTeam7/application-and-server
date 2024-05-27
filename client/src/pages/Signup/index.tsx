import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import SignupForm from "@/components/forms/SignupForm";
import { css } from "@linaria/core";
import { Button, Typography } from "@mui/material";
import { useRef, useState } from "react";
import FaceForm from "@/components/forms/FaceForm";
import { ThemeSheet } from "@/theme/ThemeSheet";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
import { useWebcam } from "@/hooks/useWebcam";

const wrapStyle = css`
  @keyframes show-up {
    0% {
      opacity: 0;
      top: 100px;
    }
    100% {
      opacity: 100%;
      top: 0px;
    }
  }
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  animation: ease show-up 300ms;
`;

export enum SignUpStep {
  FACE,
  FORM,
  FINISH,
}

export default function SignupPage() {
  const [step, setStep] = useState<SignUpStep>(SignUpStep.FORM);
  const id = useRef<string>("");
  const pw = useRef<string>("");
  const { webcamRef, saveImage, setImage } = useWebcam();
  const navigate = useNavigate();
  const requestSignUp = useAuthStore((state) => state.signUp);
  const stepComponent = [
    <FaceForm setStep={setStep} saveImage={saveImage} setImage={setImage} webcamRef={webcamRef} />,
    <SignupForm requestSignUp={requestSignUp} setStep={setStep} idRef={id} pwRef={pw} />,
    <SignUpFinish />,
  ];
  return (
    <LoginCheckContainer shouldLogin={false}>
      <div className={wrapStyle}>
        <Typography variant="h1" sx={{ marginBottom: "24px" }}>
          회원가입
        </Typography>
        {stepComponent[step]}
        {step !== SignUpStep.FINISH ? (
          <div style={{ margin: "32px" }} onClick={() => navigate("/login")}>
            계정이 있으신가요?
            <span style={{ marginLeft: "6px", color: ThemeSheet.Branded["600"] }}>돌아가기</span>
          </div>
        ) : null}
      </div>
    </LoginCheckContainer>
  );
}

function SignUpFinish() {
  const navigate = useNavigate();

  const wrapStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    & > * {
      margin-bottom: 16px !important;
    }
  `;

  return (
    <div className={wrapStyle}>
      <Typography variant="h6"> 🎉 회원가입이 완료되었어요. 🎉 </Typography>
      <Typography variant="subtitle1">로그인 화면으로 돌아가서 다시 로그인하세요.</Typography>
      <div>
        <Button variant="outlined" onClick={() => navigate("/login")}>
          돌아가기
        </Button>
      </div>
    </div>
  );
}
