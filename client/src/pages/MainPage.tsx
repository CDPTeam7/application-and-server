import { css } from "@linaria/core";
import { ThemeSheet } from "../theme/ThemeSheet";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import useAuthStore from "../store/AuthStore";
import { Navigate } from "react-router-dom";
import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import WaveBackground from "../components/NavBar";
import { PageContainer } from "../components/common/PageContainer";

const cardStyle = css`
  margin: 1rem;
`;

const wrapStyle = css`
  margin-top:calc(56px + 3rem);
  width: 100vw;
`;

export default function MainPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate replace to="/login" />;
  }

  return (
    <>
      <PageContainer>
        <Card
          variant="outlined"
          className={cardStyle}
        >
          <CardContent>
            <Typography variant="h5">내 정보</Typography>
            <Typography variant="body2">
              에코스에 로그인하고 다양한 혜택을 누려보아요.
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "1rem",
                gap: "1rem",
              }}
            >
              <EnergySavingsLeafIcon
                style={{ color: ThemeSheet.Branded[400] }}
              />
              <Typography variant="body1">
                <Typography>
                  재활용{" "}
                  <span style={{ color: ThemeSheet.Branded[400] }}>{10}</span>{" "}
                  일째
                </Typography>
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small">더보기</Button>
          </CardActions>
        </Card>
        <Card
          variant="outlined"
          className={cardStyle}
        >
          <CardContent>
            <Typography variant="h5">나의 탄소중립실천포인트</Typography>
            <Typography variant="body2">
              페트병을 재활용하고 환경보호에 실천해요!
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "1rem",
                gap: "1rem",
              }}
            >
              <Typography variant="body1">
                <Typography>
                  <span
                    style={{
                      color: ThemeSheet.Branded[400],
                      fontSize: "1.4rem",
                    }}
                  >
                    {1000}
                  </span>
                  원
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Card
          variant="outlined"
          className={cardStyle}
        >
          <CardContent>
            <Typography variant="h5">우리지역 재활용 순위</Typography>
            <Typography variant="body2">
              재활용 실천을 다같이 해보아요!
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "1rem",
                gap: "1rem",
              }}
            >
              <Typography variant="body1">
                <Typography>
                  <span
                    style={{
                      color: ThemeSheet.Branded[400],
                      fontSize: "1.4rem",
                    }}
                  >
                    {1}
                  </span>
                  위
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
