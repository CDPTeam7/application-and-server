import { Box, Button } from "@mui/material";
import { TextField } from "@mui/material";
import { css } from "@linaria/core";
import { useRef } from "react";
import { ErrorType, useErrorMessage } from "@/hooks/useErrorMessage";
import { AxiosError, AxiosResponse } from "axios";
import { ThemeSheet } from "@/theme/ThemeSheet";

const textFieldStyle = css`
  width: -webkit-fill-available;
  margin: 1rem 2rem !important;

  & input {
    color: ${ThemeSheet.Branded[700]};
  }
`;

const buttonStyle = css`
  margin: 2rem;
  margin-top: 3rem;
  & button {
    color: white;
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: space-between;
  align-items: center;
`;

interface FormState extends ErrorType {
  SUCCESS: "SUCCESS";
  PW_NOT_MATCH: "ERROR_PW_NOT_MATCH";
  ERROR_ID_NOT_EXIST: "ERROR_ID_NOT_EXIST";
}

const FORM_STATE: FormState = {
  SUCCESS: "SUCCESS",
  PW_NOT_MATCH: "ERROR_PW_NOT_MATCH",
  ERROR_ID_NOT_EXIST: "ERROR_ID_NOT_EXIST",
  INITIAL: "INITIAL",
  NOT_FOUND: "ERR_NOT_FOUND",
  INTERNAL_SERVER_ERROR: "ERR_SERVER",
};

type FormObject = "id" | "password";

const errorMessage: Record<keyof FormState, Record<FormObject, string>> = {
  SUCCESS: { id: "", password: "" },
  ERROR_ID_NOT_EXIST: { id: "아이디가 존재하지 않습니다.", password: "" },
  INITIAL: { id: "", password: "" },
  PW_NOT_MATCH: { id: "", password: "비밀번호가 일치하지 않습니다." },
  NOT_FOUND: { id: "", password: "" },
  INTERNAL_SERVER_ERROR: { id: "", password: "" },
};

interface LoginFormProps {
  requestLogin: (id: string, pw: string) => Promise<AxiosResponse>;
}

export default function LoginForm(props: LoginFormProps) {
  // const _navigate = useNavigate();

  const id = useRef("");
  const pw = useRef("");

  const { errorText, setErrorState } = useErrorMessage<FormState, FormObject>(errorMessage);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      await props.requestLogin(id.current, pw.current);
      setErrorState("SUCCESS");
    } catch (err) {
      // console.log("aa");
      const axiosErr = err as AxiosError<{ result: string }>;
      if (axiosErr.response) {
        if (axiosErr.response.data.result === FORM_STATE.PW_NOT_MATCH) setErrorState("PW_NOT_MATCH");
        if (axiosErr.response.data.result === FORM_STATE.ERROR_ID_NOT_EXIST) setErrorState("ERROR_ID_NOT_EXIST");
      }
    }
  };

  return (
    <Box onKeyDown={handleKeyDown}>
      <TextField
        error={errorText.id.length !== 0}
        helperText={errorText.id}
        label="아이디"
        variant="standard"
        name={"id"}
        className={textFieldStyle}
        id="login-id"
        onChange={(e) => (id.current = e.target.value)}
      />
      <TextField
        error={errorText.password.length !== 0}
        helperText={errorText.password}
        variant="standard"
        label="비밀번호"
        type="password"
        className={textFieldStyle}
        name={"pw"}
        id="login-pw"
        onChange={(e) => (pw.current = e.target.value)}
      />
      <div className={buttonStyle}>
        <Button variant="contained" onClick={handleLogin}>
          로그인
        </Button>
      </div>
    </Box>
  );
}
