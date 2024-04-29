import { Box, Button, Typography } from "@mui/material";
import { TextField } from "@mui/material";

import { css } from "@linaria/core";
import { useState } from "react";
import useAuthStore from "../store/AuthStore";
import { Navigate, useNavigate } from "react-router-dom";
import Icon from "../components/common/Icon";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ErrorType, useErrorMessage } from "@/hooks/useErrorMessage";
import { AxiosError } from "axios";

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
`

const textFieldStyle = css`
  width: -webkit-fill-available;
`;

interface FormState extends ErrorType {
  SUCCESS:200,
  PW_NOT_MATCH: 401,
}

const FORM_STATE:FormState = {
  SUCCESS:200,
  PW_NOT_MATCH: 401,
  INITIAL: 0,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

type FormObject = "id" | "password";

const errorMessage:Record<keyof FormState, Record<FormObject, string>> = {
  PW_NOT_MATCH: {
    id: "",
    password: "비밀번호가 일치하지 않습니다."
  },
  INITIAL: {
    id: "",
    password: ""
  },
  NOT_FOUND: {
    id: "",
    password: ""
  },
  INTERNAL_SERVER_ERROR: {
    id: "",
    password: ""
  },
  SUCCESS: {
    id: "",
    password: ""
  }
}

export default function MainPage() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const loginRequest = useAuthStore((state) => state.login);
  
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const {errorState, errorText, setErrorState} = useErrorMessage<FormState, FormObject>(errorMessage);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginRequest(id, pw);
      setErrorState("SUCCESS");
    }
    catch (err) {
      console.log(err);
      const axiosErr = (err as AxiosError);
      if(axiosErr.response?.status === FORM_STATE.PW_NOT_MATCH) {
        console.log("TEST");
        setErrorState("PW_NOT_MATCH");
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if(isAuth) {
    return <Navigate replace to="/" />
  }


  return (
    <Box className={containerStyle} onKeyDown={handleKeyDown}>
      
      <Card
        component="form"
        variant="outlined"
        className={cardStyle}
      >
        <CardContent sx={{
          "& > :not(style)": { m: 1, boxSizing: "border-box" },
        }}
        >
        <Box sx={{display:"flex", alignItems:"center", flexDirection:"column",marginBottom:"64px !important"}}>
          <Icon className={iconStyle}/>
        </Box>
          
        <Typography variant="h4">로그인</Typography>
        <Typography variant="subtitle1">
          에코스에 로그인하고 다양한 혜택을 누려보아요.
        </Typography>
        <TextField
          error={errorText.id.length !== 0}
          helperText={errorText.id}
          label="아이디"
          variant="outlined"
          name={"id"}
          value={id}
          className={textFieldStyle}
          id="login-id"
          onChange={(e) => setId(e.target.value)}
        />
        <TextField
          error={errorText.password.length !== 0}
          helperText={errorText.password}
          variant="outlined"
          label="비밀번호"
          type="password"
          className={textFieldStyle}
          name={"pw"}
          id="login-pw"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <div className={buttonGroupStyle}>
          <Button variant="outlined" onClick={() => navigate("/signup")}>
            회원가입
          </Button>
          <Button variant="contained" onClick={handleLogin}>
            로그인
          </Button>
        </div>
        </CardContent>
      </Card>
    </Box>
  );
}
