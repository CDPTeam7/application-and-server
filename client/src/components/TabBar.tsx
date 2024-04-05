import { css } from "@linaria/core";
import { ThemeSheet } from "../theme/ThemeSheet";
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { Link, useLocation } from "react-router-dom";

const tabBarStyle = css`
  height: calc(60px +(env(safe-area-inset-bottom))* 1.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 98;
  background-color: ${ThemeSheet.Branded[100]};
  box-shadow: 0 -5px 10px 0 rgba(0,0,0,.06);
  min-height: 60px;
  display: flex;
  text-align: center;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  transition: all 300ms ease;
  & a {
    color: #1f1f1f;
    text-decoration:none;
    padding-top: 12px;
    position: relative;
    flex: 1 1 auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    & svg {
      color:${ThemeSheet.Gray[700]};
      width:24px;
      height:24px;
    }
    & span {
      
      position: relative;
      z-index: 2;
      display: block;
      font-size: 1rem;
      font-weight: 500;
      margin-top: -6px;
      opacity: .7;
    }
    & strong {
      width:100%;
      height:3px;
    }
    & strong.active {
      background:${ThemeSheet.Branded[400]};
    }
  }
`

export default function TabBar() {
  const location = useLocation();
  return (
    <div className={tabBarStyle}>
      <Link to="/notifications">
        <NotificationsIcon />
        <span>알림</span>
        <strong className={location.pathname == "/notifications" ? "active" : ""}></strong>
      </Link>
      <Link to="/profile" className="active-nav">
        <PersonIcon />
        <span>내 정보</span>
        <strong className={location.pathname == "/profile" ? "active" : ""}></strong>
      </Link>
      <Link to="/">
        <HomeIcon />
        <span>메인</span>
        <strong className={location.pathname == "/" ? "active" : ""}></strong>
      </Link>
      <Link to="/ranks">
        <StackedLineChartIcon />
        <span>랭킹</span>
        <strong className={location.pathname == "/ranks" ? "active" : ""}></strong>
      </Link>
      <Link to="/points">
        <AttachMoneyIcon />
        <span>포인트</span>
        <strong className={location.pathname == "/points" ? "active" : ""}></strong>
      </Link>
    </div>
  );
}
