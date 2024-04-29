import { Box, Button, Typography } from "@mui/material";
import { TextField } from "@mui/material";

import { css } from "@linaria/core";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/AuthStore";
import { Navigate, isRouteErrorResponse, useNavigate } from "react-router-dom";
import Icon from "@/components/common/Icon";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ErrorType, useErrorMessage } from "@/hooks/useErrorMessage";
import { AxiosError } from "axios";
import SignupFinish from "./SignupFinish";

const buttonGroupStyle = css`
  margin-top: 3rem !important;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: space-between;
  & > * {
    width: 50%;
  }
`;

const containerStyle = css`
  vertical-align: middle;
  min-width: 100vw;
  overflow:hidden;
  height: 100vh;
  display: table-cell;
`;

const cardStyle = css`
  & > :not(style) {
    margin: 16px;
    box-sizing : border-box;
  }
  margin: 16px;
  border-radius:24px !important;
  border:none !important;
  box-shadow:0px 2px 4px 2px #0000000f;
`;

const iconStyle = css`
  margin: 0 auto;
  display: block;
`;

const textFieldStyle = css`
  width: -webkit-fill-available;
`;

interface FormState extends ErrorType {
  SUCCESS : 202,
  ERROR_ID_EXIST : 401,
  ERROR_PW_NOT_MATCH : 900,
}

const FORM_STATE:FormState = {
  SUCCESS: 202,
  ERROR_ID_EXIST: 401,
  ERROR_PW_NOT_MATCH: 900,
  INITIAL: 0,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

type FormObject = "password" | "id" | "passwordCheck";

const formStateMsg:Record<keyof FormState, Record<FormObject, string>> = {
  SUCCESS: {
    id: "",
    password: "",
    passwordCheck: ""
  },
  ERROR_ID_EXIST: {
    password: "",
    id: "존재하는 아이디입니다.",
    passwordCheck: ""
  },
  ERROR_PW_NOT_MATCH: {
    password: "",
    id: "",
    passwordCheck: "패스워드가 맞지 않습니다."
  },
  INITIAL: {
    password: "",
    id: "",
    passwordCheck: ""
  },
  NOT_FOUND: {
    password: "",
    id: "존재하지 않는 요청입니다. 개발자에게 문의하세요.",
    passwordCheck: ""
  },
  INTERNAL_SERVER_ERROR: {
    password: "",
    id: "",
    passwordCheck: ""
  }
}

export default function SignupPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  
  const {setErrorState, errorState, errorText} = useErrorMessage<FormState, FormObject>(formStateMsg);

  const navigate = useNavigate();
  const requestSignUp = useAuthStore((state) => state.signUp);
  const isAuth = useAuthStore(state => state.isAuth);

  const handleSignUp = async () => {
    console.log("test");

    if(pw !== pwCheck) {
      console.log("비밀번호가 일치하지 않습니다.");
      setErrorState("ERROR_PW_NOT_MATCH");
      return;
    }
    
    console.log("request start");

    try {
      const response = await requestSignUp(id, pw);
      setErrorState("SUCCESS");
    }
    catch (err) {
      const response = (err as AxiosError).response;

      if(response?.status === FORM_STATE.ERROR_ID_EXIST) {
        setErrorState("ERROR_ID_EXIST");
      }
      
      if(response?.status === FORM_STATE.INTERNAL_SERVER_ERROR) {
        console.error("서버 측 에러가 발생했습니다.");
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = async (e) => {
    if (e.key === "Enter") {
      await handleSignUp();
    }
  };

  if(isAuth) {
    return <Navigate to="/"/>
  }

  if(errorState === "SUCCESS") {
    return <SignupFinish />
  }

  return (
    <Box className={containerStyle} onKeyDown={handleKeyDown}>
      <Card
        component="form"
        variant="outlined"
        className={cardStyle}
      >
        <CardContent
          sx={{
            "& > :not(style)": { m: 1, boxSizing: "border-box" },
          }}
        >
          <Box sx={{display:"flex", alignItems:"center", flexDirection:"column",marginBottom:"64px !important"}}>
            <Icon className={iconStyle}/>
          </Box>
          <Typography variant="h4">회원가입</Typography>
          <TextField
            // title={"아이디"}
            error={errorText.id.length !== 0}
            helperText={errorText.id}
            label="아이디"
            variant="standard"
            name={"id"}
            value={id}
            className={textFieldStyle}
            id="signup-id"
            onChange={(e) => setId(e.target.value)}
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
            value={pw}
            onChange={(e) => setPw(e.target.value)}
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
            value={pwCheck}
            onChange={(e) => setPwCheck(e.target.value)}
          />
          <div className={buttonGroupStyle}>
            <Button variant="outlined" onClick={() => navigate("/login")}>
              돌아가기
            </Button>
            <Button variant="contained" onClick={handleSignUp}>
              다음
            </Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
