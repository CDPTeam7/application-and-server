import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import { css } from "@linaria/core";
import { useState } from "react";
import useAuthStore from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import Icon from "../components/common/Icon";
import BackgroundOverlay from "../components/BackgroundOverlay";
import Title from "../components/common/Title";
import Container from "../components/common/Container";

const buttonGroupStyle = css`
  margin-top:3rem;
  display:flex;
  flex-direction:row;
  gap:2rem;
  justify-content: space-between;
  & > * {
    width:50%;
  }
`

export default function MainPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const onLogin = useAuthStore((state) => state.login);

  const requestLogin = () => {
    if(onLogin(id, pw)) {
      navigate("/");
    }
    else {
      
    }
  }

  const handleKeyDown:React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if(e.key === "Enter") {
      requestLogin();
    }
  }

  return (
    <div>
      <BackgroundOverlay />
      <Icon />
      <Container onKeyDown={handleKeyDown}>
        <Title title="로그인" subtitle="에코스에 로그인하고 다양한 혜택을 누려보세요!" />
        <TextInput
          title={"아이디"}
          name={"id"}
          value={id}
          id="id"
          onChange={(e) => setId(e.target.value)}
        />
        <TextInput
          title={"비밀번호"}
          type="password"
          name={"pw"}
          id="pw"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <div className={buttonGroupStyle}>
          <Button onClick={() => navigate("/signup")} type="sub">회원가입</Button>
          <Button onClick={() => onLogin(id, pw)}>로그인</Button>
        </div>
      </Container>
    </div>
  );
}
