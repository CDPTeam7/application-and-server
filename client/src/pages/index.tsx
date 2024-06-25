export { default as LoginPage } from "./Login/LoginPage";
export { default as ProfilePage } from "./Profile/ProfilePage";
export { default as NotificationPage } from "./Notification/NotificationPage";
export { default as PointPage } from "./Point/PointPage";
export { default as SignupPage } from "./Signup";

import Card from "@/components/common/Card";
import SubPage from "@/components/SubPage";
import { css } from "@linaria/core";
import { Typography } from "@mui/material";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
import MainCardContent from "@/components/MainCardContent";
import CardContent from "@/components/common/CardContent";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import { usePoint } from "@/hooks/usePoint";
import { stringifyNumber } from "@/utils/utility";
import useAuthStore from "@/stores/useAuthStore";

const cardMargin = css`
  margin-top: 16px;
`;

export function MainPage() {
  const { getCurrentPoint } = usePoint();
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <LoginCheckContainer shouldLogin={true}>
      <SubPage title="에코스">
        <Typography variant="subtitle2">돌아오신 것을 환영합니다!</Typography>
        <Typography variant="h6">반갑습니다, {currentUser?.nickname}님!</Typography>

        <Card className={cardMargin}>
          <MainCardContent cardType="protection" />
        </Card>
        <Card className={cardMargin}>
          <MainCardContent cardType="myProfile" />
        </Card>

        <Card className={cardMargin}>
          <CardContent
            icon={EnergySavingsLeafIcon}
            subtitle={`나의 탄소중립실천포인트`}
            title={`${stringifyNumber(getCurrentPoint())} 원`}
            navigateTo="/point"
          />
        </Card>
        <Card className={cardMargin}>
          <CardContent
            icon={EnergySavingsLeafIcon}
            subtitle={`다함께 재활용 실천`}
            title={`개인/지역 순위 보러가기`}
            navigateTo="/rank"
          />
        </Card>

        <Typography variant="h6" sx={{ marginTop: "32px" }}>
          챌린지
        </Typography>
        <Typography variant="subtitle2">다양한 활동으로 환경 보호에 참여하세요!</Typography>
        <Card className={cardMargin}>
          <MainCardContent cardType="challenge" />
        </Card>
      </SubPage>
    </LoginCheckContainer>
  );
}
