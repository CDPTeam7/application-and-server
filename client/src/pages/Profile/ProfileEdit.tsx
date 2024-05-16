import { Autocomplete, Box, Button, CardActions, TextField } from "@mui/material";
import { css } from "@linaria/core";
import useProfile from "@/hooks/useProfile";
import { useState } from "react";
import SubPage from "@/components/SubPage";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
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

export default function ProfileEdit() {
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
            value={region}
            onChange={(_e, value) => {
              setRegion(value);
              setSelectedRegion(value);
            }}
          />
          <Autocomplete
            renderInput={(params) => <TextField {...params} variant="standard" label="내 구" />}
            options={selectedRegion === null ? [] : getAreaName(selectedRegion)}
            value={area}
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
