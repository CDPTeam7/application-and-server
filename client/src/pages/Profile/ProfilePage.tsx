import { css } from "@linaria/core";
import { ThemeSheet } from "../../theme/ThemeSheet";
import { Avatar, Box, Button, Typography } from "@mui/material";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import SubPage from "@/components/SubPage";
import Card from "@/components/common/Card";
import CardContent from "@/components/common/CardContent";
import CameraIcon from "@mui/icons-material/Camera";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";

const cardMargin = css`
  margin-top: 16px;
`;

const profileStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & h2 {
    font-weight: 600;
    font-size: 1.6rem;
  }
  & h3 {
    color: ${ThemeSheet.Gray[400]};
    font-size: 1.3rem;
  }
`;

export default function ProfilePage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  return (
    <LoginCheckContainer shouldLogin={true}>
      <SubPage title="내 프로필">
        <Box className={profileStyle}>
          <Avatar alt="User" src="/static/images/avatar/1.jpg" sx={{ width: 128, height: 128, marginBottom: "32px" }} />
          <Typography variant="h2">{currentUser?.nickname} 님</Typography>
          <Typography variant="h3">{currentUser?.region}</Typography>
        </Box>

        <Card className={cardMargin}>
          {/* 여기 재활용 몇일차인지 알려주는 정보 필요. */}
          <CardContent icon={EnergySavingsLeafIcon} subtitle={"나의 재활용 현황"} title={`재활용 ${10}일째`} />
        </Card>
        <Card className={cardMargin}>
          <CardContent icon={CameraIcon} subtitle={"얼굴인식이 안될 경우"} title={`얼굴인식 다시 하기`} />
        </Card>
        <Button variant="outlined" sx={{ marginTop: "32px" }} onClick={() => navigate("/profile/edit")}>
          수정하기
        </Button>
      </SubPage>
    </LoginCheckContainer>
  );
}
