import { Box, Button, Typography } from "@mui/material";
import { TextField } from "@mui/material";

import { css } from "@linaria/core";
import { useState } from "react";
import useAuthStore from "../store/AuthStore";
import { Navigate, useNavigate } from "react-router-dom";
import Icon from "../components/common/Icon";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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

export default function MainPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const onLogin = useAuthStore((state) => state.login);
  const isAuth = useAuthStore((state) => state.isAuth);

  if(isAuth) {
    return <Navigate replace to="/" />
  }
  const requestLogin = () => {
    if (onLogin(id, pw)) {
      navigate("/");
    } else {
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") {
      requestLogin();
    }
  };

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
          // title={"아이디"}
          label="아이디"
          variant="outlined"
          name={"id"}
          value={id}
          className={textFieldStyle}
          id="login-id"
          onChange={(e) => setId(e.target.value)}
        />
        <TextField
          // title={"비밀번호"}\
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
          <Button variant="contained" onClick={requestLogin}>
            로그인
          </Button>
        </div>
        </CardContent>
      </Card>
    </Box>
  );
}
