import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import { css } from "@linaria/core";
import { useState } from "react";
import useAuthStore from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import Icon from "../components/common/Icon";
import BackgroundOverlay from "../components/BackgroundOverlay";
import Container from "../components/common/Container";
import Title from "../components/common/Title";

const bodyStyle = css`
`;

const titleStyle = css`
  font-size: 1.8rem;
  margin-bottom: 2.8rem;
`;

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

export default function SignupPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const navigate = useNavigate();

  return (
    <div className={bodyStyle}>
      <BackgroundOverlay />
      <Icon />
      <Container>
        <Title title="회원가입"/>
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
        <TextInput
          title={"비밀번호 확인"}
          type="password"
          name={"pwcheck"}
          id="pwcheck"
          value={pwCheck}
          onChange={(e) => setPwCheck(e.target.value)}
        />
        <div className={buttonGroupStyle}>
          <Button type="sub" onClick={() => navigate("/login")}>이전</Button>
          <Button >다음</Button>
        </div>
      </Container>
    </div>
  );
}
