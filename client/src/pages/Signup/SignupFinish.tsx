import { Box, Button, Typography } from "@mui/material";
import { css } from "@linaria/core";
import { useNavigate } from "react-router-dom";
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
  overflow: hidden;
  height: 100vh;
  display: table-cell;
`;

const cardStyle = css`
  & > :not(style) {
    margin: 16px;
    box-sizing: border-box;
  }
  margin: 16px;
  border-radius: 24px !important;
  border: none !important;
  box-shadow: 0px 2px 4px 2px #0000000f;
`;

export default function SignupFinish() {
  const navigate = useNavigate();
  return (
    <Box className={containerStyle}>
      <Card component="form" variant="outlined" className={cardStyle}>
        <CardContent
          sx={{
            "& > :not(style)": { m: 1, boxSizing: "border-box" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", marginBottom: "64px !important" }}></Box>
          <Typography variant="h4">회원가입 완료</Typography>
          <Typography variant="subtitle1">로그인 화면으로 돌아가서 다시 로그인하세요.</Typography>
          <div className={buttonGroupStyle}>
            <Button variant="outlined" onClick={() => navigate("/login")}>
              돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
