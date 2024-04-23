import { css } from "@linaria/core";
import { ThemeSheet } from "../theme/ThemeSheet";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import useAuthStore from "../store/AuthStore";
import { Navigate, useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { PageContainer } from "../components/common/PageContainer";

const cardStyle = css`
  margin: 1rem;
  border-radius:24px !important;
  border:none !important;
  box-shadow:0px 2px 4px 2px #0000000f;
`;

const mainStyle = css`
  margin-top:56px;
`;

const profileStyle = css`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  & h2 {
    font-weight:600;
    font-size:1.6rem;
  }
  & h3 {
    color:${ThemeSheet.Gray[400]};
    font-size:1.3rem;
  }
`

export default function MainPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  if (!isLoggedIn) {
    return <Navigate replace to="/login" />;
  }

  return (
    <>
      <PageContainer className={mainStyle}>
        <Box className={profileStyle}>
          <Avatar
            alt="User"
            src="/static/images/avatar/1.jpg"
            sx={{ width: 128, height: 128, marginBottom:"32px"}}
          />
          <Typography variant="h2">
            김민욱 님
          </Typography>
          <Typography variant="h3">
            대구광역시 북구
          </Typography>
        </Box>
        
        <Card
          variant="outlined"
          className={cardStyle}
        >
          <CardContent>
            
            <Typography variant="h5">나의 재활용 현황</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop:"16px"
              }}
            >
              <EnergySavingsLeafIcon
                style={{ color: ThemeSheet.Branded[400] }}
              />
              <Typography variant="body1">
                재활용{" "}
                <span style={{ color: ThemeSheet.Branded[400] }}>{10}</span>{" "}
                일째
              </Typography>
            </Box>
          </CardContent>
          
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
            </Box>
          </CardContent>
          <CardActions>
            <Button onClick={() => navigate("points")}>더보기</Button>
          </CardActions>
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
            </Box>
          </CardContent>
          <CardActions>
            <Button onClick={() => navigate("points")}>더보기</Button>
          </CardActions>
        </Card>
      </PageContainer>
    </>
  );
}
