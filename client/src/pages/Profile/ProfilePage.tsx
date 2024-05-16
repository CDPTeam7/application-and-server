import { css } from "@linaria/core";
import { ThemeSheet } from "../../theme/ThemeSheet";
import { Button, Typography } from "@mui/material";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
import SubPage from "@/components/SubPage";
import CameraIcon from "@mui/icons-material/Camera";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import CameraModal from "@/components/common/CameraModal";
import { useState } from "react";
import { useWebcam } from "@/hooks/useWebcam";

const uploadBarStyle = css`
  display: flex;
  width: -webkit-fill-available;
  margin: 1rem 0rem !important;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid ${ThemeSheet.Gray[200]} !important;
  height: 64px;
  & svg {
    color: ${ThemeSheet.Gray[700]};
    margin-right: 6px;
  }
  & span {
    color: ${ThemeSheet.Gray[600]};
  }
`;

export default function ProfilePage() {
  const { setImage, saveImage, webcamRef } = useWebcam();
  const [show, setShow] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  return (
    <LoginCheckContainer shouldLogin={true}>
      <SubPage title="내 정보">
        {/* <Box className={profileStyle}>
          <Avatar alt="User" src="/static/images/avatar/1.jpg" sx={{ width: 128, height: 128, marginBottom: "32px" }} />
        </Box> */}
        <Typography variant="h6">{currentUser?.nickname} 님</Typography>
        <Typography variant="subtitle2">{`${currentUser?.region} ${currentUser?.area}`}</Typography>
        <Typography variant="h6" sx={{ marginTop: "16px" }}>
          얼굴 인식이 안되세요?
        </Typography>
        <Button className={uploadBarStyle}>
          <CameraIcon />
          <span>카메라 촬영하기</span>
        </Button>
        <Button className={uploadBarStyle} onClick={() => setShow(true)}>
          <UploadIcon />
          <span>인식 가능한 얼굴 업로드</span>
        </Button>
        <CameraModal
          isShow={show}
          setShow={setShow}
          setImage={setImage}
          saveImage={saveImage}
          transactionType="set"
          webcamRef={webcamRef}
          clickEventHandler={() => {}}
        />
        <Typography variant="h6" sx={{ marginTop: "16px" }}>
          내 정보 수정하기
        </Typography>
        <Button variant="outlined" sx={{ marginTop: "32px" }} onClick={() => navigate("/profile/edit")}>
          수정하기
        </Button>
      </SubPage>
    </LoginCheckContainer>
  );
}
