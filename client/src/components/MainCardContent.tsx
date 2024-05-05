import { Button, CardMedia, Typography } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import ParkIcon from "@mui/icons-material/Park";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { css } from "@linaria/core";
import { ThemeSheet } from "@/theme/ThemeSheet";
import { useNavigate } from "react-router-dom";

type CardType = "protection" | "myProfile" | "challenge";

interface MainCardProps {
  cardType: CardType;
}

export default function MainCard(props: MainCardProps) {
  const type = props.cardType;
  if (type === "protection") {
    return <ProtectionContent />;
  }
  if (type === "myProfile") {
    return <MyProfileContent />;
  }
  if (type === "challenge") {
    return <ChallengeContent />;
  }
}

function ProtectionContent() {
  const flexBox = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin-top: 16px;
    & > * {
      position: relative;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      & > .title {
        font-weight: 600;
        font-size: 18px;
      }

      & > .data {
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }
    & .Icon {
      width: 128px;
      height: 128px;
      opacity: 0.3;
    }
    & .tree {
      color: green;
    }
  `;
  return (
    <>
      <Typography variant="h6">현재 탄소중립실천 현황</Typography>
      <Typography variant="subtitle2">Ecoce 전체 회원 기준</Typography>
      <div className={flexBox}>
        <div>
          <div className="title">탄소 저감량</div>
          <div className="data">50% 감소</div>
          <CloudIcon className="Icon" />
        </div>
        <div>
          <div className="title">대체 소나무</div>
          <div className="data">22.6 그루</div>
          <ParkIcon className="tree Icon" />
        </div>
      </div>
    </>
  );
}

function MyProfileContent() {
  const navigate = useNavigate();
  const myProfileStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    & .content {
      display: flex;
      align-items: center;
      & .icon {
        color: ${ThemeSheet.Gray[400]};
        width: 48px;
        height: 48px;
        margin-right: 16px;
      }
    }
    & button {
      min-width: 0 !important;
      border-radius: 50%;
    }
  `;
  return (
    <>
      <div className={myProfileStyle}>
        <div className="content">
          <AccountCircleIcon className="icon" />
          <div>
            <Typography variant="subtitle2">나에 관한 모든 정보</Typography>
            <Typography variant="h6">내 정보 보러가기</Typography>
          </div>
        </div>

        <Button onClick={() => navigate("/profile")}>
          <ArrowForwardIosIcon />
        </Button>
      </div>
    </>
  );
}

function ChallengeContent() {
  const imageStyle = css`
    position: relative;
    top: -16px;
    left: -16px;
    width: calc(100% + 32px) !important;
  `;
  return (
    <>
      <CardMedia className={imageStyle} component="img" height="192" image="/background.jpg" alt="background" />
      <Typography variant="subtitle1">[에코스] 탄소중립생활실천 챌린지</Typography>
      <Typography variant="subtitle2">2024. 03. 01 ~ 2025. 03. 01</Typography>
    </>
  );
}
