import { Autocomplete, Avatar, Badge, Box, Button, CardActions, TextField, Typography } from "@mui/material";
import { PageContainer } from "../../components/common/PageContainer";
import EditIcon from "@mui/icons-material/Edit";
import { css } from "@linaria/core";
import PageCard from "../../components/common/PageCard";
import { ThemeSheet } from "@/theme/ThemeSheet";
import useAuthStore from "@/stores/useAuthStore";
import useProfile from "@/hooks/useProfile";
import { useRef } from "react";

const textFieldStyle = css`
  margin-top: 1.2rem !important;
  width: 100%;
  & input {
    font-size: 20px;
  }
  & label {
    font-size: 18px;
  }
`;

const cardStyle = css`
  margin: 1rem;
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

export default function ProfileEdit() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { nickname, region, changeProfile } = useProfile();

  return (
    <PageContainer>
      <PageCard className={cardStyle}>
        <Box className={profileStyle}>
          <Badge
            sx={{ mb: "16px" }}
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <EditIcon
                sx={{
                  borderRadius: "50%",
                  padding: "3px",
                  background: "black",
                  color: "white",
                }}
              />
            }
          >
            <Avatar alt="User" src="/static/images/avatar/1.jpg" sx={{ width: 128, height: 128 }} />
          </Badge>
        </Box>
        <Box sx={{ margin: "8px" }}>
          <TextField
            variant="standard"
            onChange={(e) => (nickname.current = e.target.value)}
            value={nickname.current}
            label="이름"
            className={textFieldStyle}
          />
          <Autocomplete
            renderInput={(params) => <TextField {...params} variant="standard" label="내 지역" />}
            options={["대구"]}
            className={textFieldStyle}
          />
        </Box>
        <CardActions>
          <Button variant="contained" onClick={() => {}}>
            {/* changeProfile 을 이용하여 적용 */}
            저장
          </Button>
        </CardActions>
      </PageCard>
    </PageContainer>
  );
}
