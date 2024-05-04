import { ErrorType, useErrorMessage } from "@/hooks/useErrorMessage";
import SignupFinish from "@/pages/Signup/SignupFinish";
import { ThemeSheet } from "@/theme/ThemeSheet";
import { css } from "@linaria/core";
import { Button, TextField } from "@mui/material";
import { AxiosResponse } from "axios";
import { useRef } from "react";

const buttonStyle = css`
  margin: 2rem;
  & button {
    color: white;
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const textFieldStyle = css`
  width: -webkit-fill-available;
  margin: 1rem 2rem !important;

  & input {
    color: ${ThemeSheet.Branded[700]};
  }
`;

interface SignupFormProps {
  requestSignUp: (id: string, pw: string) => Promise<AxiosResponse>;
  setStep: React.Dispatch<number>;
}

interface FormState extends ErrorType {
  SUCCESS: 202;
  ERROR_ID_EXIST: 401;
  ERROR_PW_NOT_MATCH: 900;
}

const FORM_STATE: FormState = {
  SUCCESS: 202,
  ERROR_ID_EXIST: 401,
  ERROR_PW_NOT_MATCH: 900,
  INITIAL: 0,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

type FormObject = "password" | "id" | "passwordCheck";

const formStateMsg: Record<keyof FormState, Record<FormObject, string>> = {
  SUCCESS: {
    id: "",
    password: "",
    passwordCheck: "",
  },
  ERROR_ID_EXIST: {
    password: "",
    id: "존재하는 아이디입니다.",
    passwordCheck: "",
  },
  ERROR_PW_NOT_MATCH: {
    password: "",
    id: "",
    passwordCheck: "패스워드가 맞지 않습니다.",
  },
  INITIAL: {
    password: "",
    id: "",
    passwordCheck: "",
  },
  NOT_FOUND: {
    password: "",
    id: "존재하지 않는 요청입니다. 개발자에게 문의하세요.",
    passwordCheck: "",
  },
  INTERNAL_SERVER_ERROR: {
    password: "",
    id: "",
    passwordCheck: "",
  },
};

export default function SignupForm(props: SignupFormProps) {
  const id = useRef("");
  const nickname = useRef("");
  const pw = useRef("");
  const pwCheck = useRef("");
  const { requestSignUp, setStep } = props;

  const { setErrorState, errorState, errorText } = useErrorMessage<FormState, FormObject>(formStateMsg);

  const handleSignUp = async () => {
    console.log("test");

    if (pw.current !== pwCheck.current) {
      console.log("비밀번호가 일치하지 않습니다.");
      setErrorState("ERROR_PW_NOT_MATCH");
      return;
    }

    console.log("request start");

    try {
      // 얼굴 등록을 하기
      // await requestSignUp(id.current, pw.current);
      setErrorState("SUCCESS");
      setStep(1);
    } catch (err) {
      const response = err as AxiosResponse;
      if (response?.status === FORM_STATE.ERROR_ID_EXIST) {
        setErrorState("ERROR_ID_EXIST");
      }

      if (response?.status === FORM_STATE.INTERNAL_SERVER_ERROR) {
        console.error("서버 측 에러가 발생했습니다.");
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = async (e) => {
    if (e.key === "Enter") {
      await handleSignUp();
    }
  };

  if (errorState === "SUCCESS") {
    return <SignupFinish />;
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <TextField
        // title={"아이디"}
        error={errorText.id.length !== 0}
        helperText={errorText.id}
        label="아이디"
        variant="standard"
        name={"id"}
        className={textFieldStyle}
        id="signup-id"
        onChange={(e) => (id.current = e.target.value)}
      />
      <TextField
        // title={"아이디"}
        label="닉네임 (회수기에 표시될 이름)"
        variant="standard"
        name={"nickname"}
        className={textFieldStyle}
        id="signup-nickname"
        onChange={(e) => (nickname.current = e.target.value)}
      />
      <TextField
        // title={"비밀번호"}\
        error={errorText.password.length !== 0}
        helperText={errorText.password}
        variant="standard"
        label="비밀번호"
        type="password"
        className={textFieldStyle}
        name={"pw"}
        id="signup-pw"
        onChange={(e) => (pw.current = e.target.value)}
      />
      <TextField
        // title={"비밀번호"}\
        error={errorText.passwordCheck.length !== 0}
        helperText={errorText.passwordCheck}
        variant="standard"
        label="비밀번호 확인"
        type="password"
        className={textFieldStyle}
        name="pw-check"
        id="signup-pw-check"
        onChange={(e) => (pwCheck.current = e.target.value)}
      />

      <div className={buttonStyle}>
        <Button variant="contained" onClick={handleSignUp}>
          다음
        </Button>
      </div>
    </div>
  );
}
