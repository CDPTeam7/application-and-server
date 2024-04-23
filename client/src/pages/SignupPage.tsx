import { Box, Button, Typography } from "@mui/material";
import { TextField } from "@mui/material";

import { css } from "@linaria/core";
import { useState } from "react";
import useAuthStore from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
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
`;

const textFieldStyle = css`
  width: -webkit-fill-available;
`;

export default function SignupPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const navigate = useNavigate();
  const onLogin = useAuthStore((state) => state.login);

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
            label="아이디"
            variant="filled"
            name={"id"}
            value={id}
            className={textFieldStyle}
            id="signup-id"
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            // title={"비밀번호"}\
            variant="filled"
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
            variant="filled"
            label="비밀번호 확인"
            type="password"
            className={textFieldStyle}
            name={"pw-check"}
            id="signup-pw-check"
            value={pwCheck}
            onChange={(e) => setPwCheck(e.target.value)}
          />
          <div className={buttonGroupStyle}>
            <Button variant="outlined" onClick={() => navigate("/login")}>
              돌아가기
            </Button>
            <Button variant="contained">
              다음
            </Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
