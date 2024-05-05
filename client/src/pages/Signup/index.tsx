import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import SignupForm from "@/components/forms/SignupForm";
import { css } from "@linaria/core";
import { Typography } from "@mui/material";
import { useState } from "react";
import FaceForm from "@/components/forms/FaceForm";
import { ThemeSheet } from "@/theme/ThemeSheet";
import LoginCheckContainer from "@/containers/LoginCheckContainer";

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

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const requestSignUp = useAuthStore((state) => state.signUp);

  return (
    <LoginCheckContainer shouldLogin={false}>
      <div className={wrapStyle}>
        <Typography variant="h1" sx={{ marginBottom: "24px" }}>
          회원가입
        </Typography>
        {step === 0 ? <FaceForm setStep={setStep} /> : <SignupForm requestSignUp={requestSignUp} setStep={setStep} />}
        <div style={{ margin: "32px" }} onClick={() => navigate("/login")}>
          계정이 있으신가요?
          <span style={{ marginLeft: "6px", color: ThemeSheet.Branded["600"] }}>돌아가기</span>
        </div>
      </div>
    </LoginCheckContainer>
  );
}
