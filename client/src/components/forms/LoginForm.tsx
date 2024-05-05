import { Box, Button } from "@mui/material";
import { TextField } from "@mui/material";
import { css } from "@linaria/core";
import { useRef } from "react";
import { ErrorType, useErrorMessage } from "@/hooks/useErrorMessage";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
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
  SUCCESS: 200;
  PW_NOT_MATCH: 401;
}

const FORM_STATE: FormState = {
  SUCCESS: 200,
  PW_NOT_MATCH: 401,
  INITIAL: 0,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

type FormObject = "id" | "password";

const errorMessage: Record<keyof FormState, Record<FormObject, string>> = {
  PW_NOT_MATCH: {
    id: "",
    password: "비밀번호가 일치하지 않습니다.",
  },
  INITIAL: {
    id: "",
    password: "",
  },
  NOT_FOUND: {
    id: "",
    password: "",
  },
  INTERNAL_SERVER_ERROR: {
    id: "",
    password: "",
  },
  SUCCESS: {
    id: "",
    password: "",
  },
};

interface LoginFormProps {
  requestLogin: (id: string, pw: string) => Promise<AxiosResponse>;
}

export default function LoginForm(props: LoginFormProps) {
  const navigate = useNavigate();

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
      console.log(err);
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === FORM_STATE.PW_NOT_MATCH) {
        console.log("TEST");
        setErrorState("PW_NOT_MATCH");
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
