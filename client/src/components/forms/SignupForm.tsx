import { SignUpParam } from "@/api";
import { ErrorType, useErrorMessage } from "@/hooks/useErrorMessage";
import { SignUpStep } from "@/pages/Signup";
import { ThemeSheet } from "@/theme/ThemeSheet";
import { getAreaName, getRegionName } from "@/types/Region";
import { css } from "@linaria/core";
import { Autocomplete, Button, TextField } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import { useRef, useState } from "react";

const buttonStyle = css`
  margin: 2rem;
  & button {
    color: white;
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const textFieldStyle = css`
  width: -webkit-fill-available;
  margin: 1rem 2rem !important;

  & input {
    color: ${ThemeSheet.Branded[700]};
  }
`;

interface SignupFormProps {
  requestSignUp: (data: SignUpParam) => Promise<AxiosResponse>;
  setStep: React.Dispatch<SignUpStep>;
  idRef: React.MutableRefObject<string>;
  pwRef: React.MutableRefObject<string>;
}

interface FormState extends ErrorType {
  SUCCESS: "SUCCESS";
  ERR_PW_NOT_MATCH: "ERR_PW_NOT_MATCH";
  ERR_ID_EXIST: "ERROR_ID_EXIST";
  ERR_AREA_NOT_SET: "ERR_AREA_NOT_SET";
  ERR_REGION_NOT_SET: "ERR_REGION_NOT_SET";
  ERR_PW_CONSTRAINT: "ERR_PW_CONSTRAINT";
  ERR_ID_CONSTRAINT: "ERR_ID_CONSTRAINT";
}

const FORM_STATE: FormState = {
  INITIAL: "INITIAL",
  NOT_FOUND: "ERR_NOT_FOUND",
  INTERNAL_SERVER_ERROR: "ERR_SERVER",
  SUCCESS: "SUCCESS",
  ERR_PW_NOT_MATCH: "ERR_PW_NOT_MATCH",
  ERR_ID_EXIST: "ERROR_ID_EXIST",
  ERR_PW_CONSTRAINT: "ERR_PW_CONSTRAINT",
  ERR_ID_CONSTRAINT: "ERR_ID_CONSTRAINT",
  ERR_AREA_NOT_SET: "ERR_AREA_NOT_SET",
  ERR_REGION_NOT_SET: "ERR_REGION_NOT_SET",
};

type FormObject = "password" | "id" | "passwordCheck" | "region" | "area";

const formStateMsg: Record<keyof FormState, Record<FormObject, string>> = {
  SUCCESS: {
    id: "",
    password: "",
    passwordCheck: "",
    region: "",
    area: "",
  },
  ERR_ID_EXIST: {
    password: "",
    id: "존재하는 아이디입니다.",
    passwordCheck: "",
    region: "",
    area: "",
  },
  ERR_PW_NOT_MATCH: {
    password: "",
    id: "",
    passwordCheck: "패스워드가 맞지 않습니다.",
    region: "",
    area: "",
  },
  INITIAL: {
    password: "",
    id: "",
    passwordCheck: "",
    region: "",
    area: "",
  },
  NOT_FOUND: {
    password: "",
    id: "존재하지 않는 요청입니다. 개발자에게 문의하세요.",
    passwordCheck: "",
    region: "",
    area: "",
  },
  INTERNAL_SERVER_ERROR: {
    password: "",
    id: "",
    passwordCheck: "",
    region: "",
    area: "",
  },
  ERR_AREA_NOT_SET: {
    area: "현재 거주 중인 지역구를 선택해주세요.",
    password: "",
    id: "",
    passwordCheck: "",
    region: "",
  },
  ERR_REGION_NOT_SET: {
    password: "",
    id: "",
    passwordCheck: "",
    region: "현재 거주 중인 시를 선택해주세요.",
    area: "",
  },
  ERR_PW_CONSTRAINT: {
    password: "비밀번호는 숫자, 영문이 최소 1개 이상 조합된 6-16자 입니다.",
    id: "",
    passwordCheck: "비밀번호는 숫자, 영문이 최소 1개 이상 조합된 6-16자 입니다.",
    region: "",
    area: "",
  },
  ERR_ID_CONSTRAINT: {
    password: "",
    id: "아이디는 숫자, 영문이 최소 1개 이상 조합된 6-16자 입니다.",
    passwordCheck: "",
    region: "",
    area: "",
  },
};

export default function SignupForm(props: SignupFormProps) {
  const id = props.idRef;
  const pw = props.pwRef;
  const nickname = useRef("");
  const pwCheck = useRef("");
  const region = useRef<string | null>(null);
  const area = useRef<string | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const { requestSignUp, setStep } = props;

  const { setErrorState, errorText } = useErrorMessage<FormState, FormObject>(formStateMsg);

  const handleSignUp = async () => {
    const regex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}$/;

    if (!regex.test(id.current)) {
      setErrorState("ERR_ID_CONSTRAINT");
      return;
    }

    if (!regex.test(pw.current)) {
      setErrorState("ERR_PW_CONSTRAINT");
      console.log("PW_CONSTRAINT");
      return;
    }

    if (pw.current !== pwCheck.current) {
      setErrorState("ERR_PW_NOT_MATCH");
      return;
    }

    if (region.current === null) {
      setErrorState("ERR_REGION_NOT_SET");
      return;
    }

    if (area.current === null) {
      setErrorState("ERR_AREA_NOT_SET");
      return;
    }

    try {
      // 얼굴 등록을 하기
      if (region.current === null) {
        throw Error("Region not set");
      }
      if (area.current === null) {
        throw Error("Area not set");
      }

      await requestSignUp({
        id: id.current,
        password: pw.current,
        nickname: nickname.current,
        region: region.current,
        area: area.current,
      });

      setErrorState("SUCCESS");
      setStep(2);
    } catch (err) {
      const response = err as AxiosError<{ result: string }>;
      if (response.response) {
        const ret = response.response.data.result;
        if (ret === FORM_STATE.ERR_ID_EXIST) {
          setErrorState("ERR_ID_EXIST");
        }

        if (ret === FORM_STATE.ERR_PW_NOT_MATCH) {
          console.error("서버 측 에러가 발생했습니다.");
        }
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = async (e) => {
    if (e.key === "Enter") {
      await handleSignUp();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <TextField
        error={errorText.id.length !== 0}
        helperText={errorText.id}
        label="아이디"
        variant="standard"
        name={"id"}
        className={textFieldStyle}
        id="signup-id"
        onChange={(e) => (id.current = e.target.value)}
      />
      <TextField
        // title={"아이디"}
        label="닉네임 (회수기에 표시될 이름)"
        variant="standard"
        name={"nickname"}
        className={textFieldStyle}
        id="signup-nickname"
        onChange={(e) => (nickname.current = e.target.value)}
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
        onChange={(_e, value) => {
          region.current = value;
          area.current = "";
          setSelectedArea(null);
          setSelectedRegion(value);
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
        options={selectedRegion === null ? [] : getAreaName(selectedRegion)}
        className={textFieldStyle}
        inputValue={selectedArea ?? ""}
        onChange={(_e, value) => {
          area.current = value;
          setSelectedArea(value);
        }}
      />
      <TextField
        // title={"비밀번호"}\
        error={errorText.password.length !== 0}
        helperText={errorText.password}
        variant="standard"
        label="비밀번호"
        type="password"
        className={textFieldStyle}
        name={"pw"}
        id="signup-pw"
        onChange={(e) => (pw.current = e.target.value.trim())}
      />
      <TextField
        // title={"비밀번호"}\
        error={errorText.passwordCheck.length !== 0}
        helperText={errorText.passwordCheck}
        variant="standard"
        label="비밀번호 확인"
        type="password"
        className={textFieldStyle}
        name="pw-check"
        id="signup-pw-check"
        onChange={(e) => (pwCheck.current = e.target.value)}
      />

      <div className={buttonStyle}>
        <Button variant="contained" onClick={handleSignUp}>
          다음
        </Button>
      </div>
    </div>
  );
}
