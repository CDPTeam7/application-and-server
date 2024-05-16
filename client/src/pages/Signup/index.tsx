import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import SignupForm from "@/components/forms/SignupForm";
import { css } from "@linaria/core";
import { Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
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
  const [step, setStep] = useState<SignUpStep>(SignUpStep.FACE);
  const id = useRef<string>("");
  const pw = useRef<string>("");
  const { webcamRef, saveImage, setImage } = useWebcam();
  const navigate = useNavigate();
  const requestSignUp = useAuthStore((state) => state.signUp);
  const stepComponent = [
    <FaceForm setStep={setStep} saveImage={saveImage} setImage={setImage} webcamRef={webcamRef} />,
    <SignupForm requestSignUp={requestSignUp} setStep={setStep} idRef={id} pwRef={pw} />,
    <SignUpFinish setImage={setImage} id={id.current} pw={pw.current} />,
  ];
  return (
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
  );
}

function SignUpFinish(props: { id: string; pw: string; setImage: () => void }) {
  const { id, pw, setImage } = props;
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const [pending, setPending] = useState<"pending" | "success" | "fail">("pending");
  const wrapStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    & > * {
      margin-bottom: 16px !important;
    }
  `;

  useEffect(() => {
    (async () => {
      try {
        // 지정된 정보로 로그인
        await login(id, pw);
        // 이미지 정보 등록
        await setImage();
        // 로그아웃
        await logout();

        setPending("success");
      } catch {
        setPending("fail");
        throw Error("회원가입에 실패했습니다.");
      }
    })();
  }, []);

  if (pending === "pending") return "가입 중...";

  return pending === "success" ? (
    <div className={wrapStyle}>
      <Typography variant="h6"> 🎉 회원가입이 완료되었어요. 🎉 </Typography>
      <Typography variant="subtitle1">로그인 화면으로 돌아가서 다시 로그인하세요.</Typography>
      <div>
        <Button variant="outlined" onClick={() => navigate("/login")}>
          돌아가기
        </Button>
      </div>
    </div>
  ) : (
    <div className={wrapStyle}>
      <Typography variant="h6"> 회원 가입에 실패했습니다. </Typography>
      <Typography variant="subtitle1"></Typography>
      <div>
        <Button variant="outlined" onClick={() => navigate("/login")}>
          돌아가기
        </Button>
      </div>
    </div>
  );
}
