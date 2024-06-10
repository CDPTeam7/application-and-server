import { Autocomplete, Box, Button, CardActions, TextField } from "@mui/material";
import { css } from "@linaria/core";
import useProfile from "@/hooks/useProfile";
import { useState } from "react";
import SubPage from "@/components/SubPage";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
import { getAreaName, getRegionName } from "@/types/Region";
import { ErrorType, useErrorMessage } from "@/hooks/useErrorMessage";

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

interface ProfileEditState extends ErrorType {
  SUCCESS: "SUCCESS";
  ERR_NAME_NOT_SET: "ERR_NAME_NOT_SET";
  ERR_AREA_NOT_SET: "ERR_AREA_NOT_SET";
  ERR_REGION_NOT_SET: "ERR_REGION_NOT_SET";
}

const PROFILE_EDIT_STATE: ProfileEditState = {
  INITIAL: "INITIAL",
  NOT_FOUND: "ERR_NOT_FOUND",
  INTERNAL_SERVER_ERROR: "ERR_SERVER",
  SUCCESS: "SUCCESS",
  ERR_NAME_NOT_SET: "ERR_NAME_NOT_SET",
  ERR_AREA_NOT_SET: "ERR_AREA_NOT_SET",
  ERR_REGION_NOT_SET: "ERR_REGION_NOT_SET",
};

type ProfileEditObject = "name" | "region" | "area";

const formStateMsg: Record<keyof ProfileEditState, Record<ProfileEditObject, string>> = {
  SUCCESS: {
    name: "",
    region: "",
    area: "",
  },
  ERR_NAME_NOT_SET: {
    name: "이름을 적어주세요",
    region: "",
    area: "",
  },
  ERR_AREA_NOT_SET: {
    name: "",
    region: "",
    area: "구를 설정해주세요",
  },
  ERR_REGION_NOT_SET: {
    name: "",
    region: "지역을 설정해주세요",
    area: "",
  },
  INITIAL: {
    name: "",
    region: "",
    area: "",
  },
  NOT_FOUND: {
    name: "",
    region: "",
    area: "",
  },
  INTERNAL_SERVER_ERROR: {
    name: "",
    region: "",
    area: "",
  },
};

export default function ProfileEdit() {
  const { nickname, setNickname, setRegion, region, area, setArea, changeProfile } = useProfile();

  const { setErrorState, errorText } = useErrorMessage<ProfileEditState, ProfileEditObject>(formStateMsg);

  const handleChangeProfile = () => {
    if (nickname === "" || nickname === null) {
      setErrorState("ERR_NAME_NOT_SET");
      return;
    }
    if (region === null) {
      setErrorState("ERR_REGION_NOT_SET");
      return;
    }
    if (area === null) {
      setErrorState("ERR_AREA_NOT_SET");
      return;
    }

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
            helperText={errorText.name}
            error={errorText.name.length !== 0}
            label="이름"
            className={textFieldStyle}
          />
          <Autocomplete
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={errorText.region}
                error={errorText.region.length !== 0}
                variant="standard"
                label="내 시"
              />
            )}
            options={getRegionName()}
            className={textFieldStyle}
            value={region}
            onChange={(_e, value) => {
              setRegion(value);
              setArea(null);
            }}
          />
          <Autocomplete
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={errorText.area}
                error={errorText.area.length !== 0}
                variant="standard"
                label="내 구"
              />
            )}
            options={region === null ? [] : getAreaName(region)}
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
