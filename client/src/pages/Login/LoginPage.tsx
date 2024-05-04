import { Box, Typography } from "@mui/material";
import { css } from "@linaria/core";
import LeafIcon from "@/components/icons/LeafIcon";
import { useNavigate } from "react-router-dom";
import { ThemeSheet } from "@/theme/ThemeSheet";
import useAuthStore from "@/stores/useAuthStore";
import LoginForm from "@/components/forms/LoginForm";
import LoginCheckContainer from "@/containers/LoginCheckContainer";

const splashStyle = css`
  color: ${ThemeSheet.Branded[400]};
  font-weight: 800;
`;

const svgStyle = css`
  width: 32px;
  height: 32px;
  fill: green;
  color: ${ThemeSheet.Branded[400]};
`;

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
  background: rgb(248, 255, 244);
  animation: ease show-up 300ms;
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const requestLogin = useAuthStore((state) => state.login);
  return (
    <LoginCheckContainer shouldLogin={false}>
      <div className={wrapStyle}>
        <Typography variant="h3" className={splashStyle}>
          <LeafIcon className={svgStyle} /> Ecoce
        </Typography>
        <Typography variant="h5" sx={{ color: "#556b2f", my: "32px", fontWeight: "600" }}>
          Welcome to Ecoce
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#515151", fontSize: "17px" }}>
          에코스에 로그인하고 다양한 혜택을 누려보아요.
        </Typography>
        <LoginForm requestLogin={requestLogin} />
        <Box sx={{ margin: "32px" }}>
          <span style={{ marginRight: "8px" }}>계정이 없으신가요?</span>
          <a style={{ color: ThemeSheet.Branded[600] }} onClick={() => navigate("/signup")}>
            회원가입
          </a>
        </Box>
      </div>
    </LoginCheckContainer>
  );
}
