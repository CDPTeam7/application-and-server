import { Autocomplete, Avatar, Badge, Box, Button, CardActions, TextField, Typography } from "@mui/material";
import { PageContainer } from "../../components/common/PageContainer";
import EditIcon from "@mui/icons-material/Edit";
import { css } from "@linaria/core";
import PageCard from "../../components/common/PageCard";
import { ThemeSheet } from "@/theme/ThemeSheet";
import useAuthStore from "@/stores/useAuthStore";
import useProfile from "@/hooks/useProfile";
import { useRef, useState } from "react";
import SubPage from "@/components/SubPage";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
import SignUpForm from "@/components/forms/SignUpForm";
import { getAreaName, getRegionName } from "@/types/Region";

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
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { nickname, setNickname, setRegion, region, area, setArea, changeProfile } = useProfile();

  const handleChangeProfile = () => {
    if (region === null) return;
    if (area === null) return;
    if (nickname === null) return;
    changeProfile({
      region,
      area,
      nickname,
    });
  };

  return (
    <LoginCheckContainer shouldLogin={true}>
      <SubPage title={"내 정보 수정"}>
        <Box sx={{ margin: "8px" }}>
          <TextField
            variant="standard"
            onChange={(e) => setNickname(e.target.value)}
            value={nickname}
            label="이름"
            className={textFieldStyle}
          />
          <Autocomplete
            renderInput={(params) => <TextField {...params} variant="standard" label="내 시" />}
            options={getRegionName()}
            className={textFieldStyle}
            onChange={(_e, value) => {
              setRegion(value);
              setSelectedRegion(value);
            }}
          />
          <Autocomplete
            renderInput={(params) => <TextField {...params} variant="standard" label="내 구" />}
            options={selectedRegion === null ? [] : getAreaName(selectedRegion)}
            className={textFieldStyle}
            onChange={(_e, value) => {
              setArea(value);
            }}
          />
        </Box>
        <CardActions>
          <Button variant="contained" onClick={handleChangeProfile}>
            {/* changeProfile 을 이용하여 적용 */}
            저장
          </Button>
        </CardActions>
      </SubPage>
    </LoginCheckContainer>
  );
}
