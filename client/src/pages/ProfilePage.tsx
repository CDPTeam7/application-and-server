import useAuthStore from "../store/AuthStore";
import { Navigate } from "react-router-dom";
import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  CardActions,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { PageContainer } from "../components/common/PageContainer";
import EditIcon from "@mui/icons-material/Edit";
import { css } from "@linaria/core";
import { useEffect, useState } from "react";
import PageCard from "../components/common/PageCard";

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

export default function ProfilePage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [editState, setEditState] = useState(false);

  // business logic 에서 초기값을 가져온다.
  const [name, setName] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);

  useEffect(() => {
    // 여기서 페치해옴. 이것도 비즈니스?
    setName("김김김");
    setPlace("목포");
    // 페치에 실패했으면?
  }, []);

  if (!isLoggedIn) {
    return <Navigate replace to="/login" />;
  }

  if (name === null || place === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    );
  }

  return (
    <PageContainer>
      <PageCard>
        <Typography variant="h5" margin={1}>
          내 정보
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Badge
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
            <Avatar
              alt="User"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 128, height: 128 }}
            />
          </Badge>
        </div>
        <Box sx={{ margin: "8px" }}>
          <TextField
            variant="standard"
            value={name ?? ""}
            onChange={(e) => setName(e.target.value)}
            label="이름"
            InputProps={{
              readOnly: !editState,
            }}
            className={textFieldStyle}
          />
          <Autocomplete
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="내 지역" />
            )}
            options={[]}
            className={textFieldStyle}
          />
          <TextField
            variant="standard"
            value="김김김"
            label="이름"
            InputProps={{
              readOnly: !editState,
            }}
            className={textFieldStyle}
          />
        </Box>
        <CardActions>
          <Button variant="outlined" onClick={() => setEditState(!editState)}>
            {editState ? "저장하기" : "수정하기"}
          </Button>
        </CardActions>
      </PageCard>
    </PageContainer>
  );
}
