import { css } from "@linaria/core";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const tabBarStyle = css`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const tabBarRoutes = [
  {
    path: "/notifications",
    icon: <NotificationsIcon />,
    label: "알림",
  },
  {
    path: "/profile",
    icon: <PersonIcon />,
    label: "프로필",
  },
  {
    path: "/",
    icon: <HomeIcon />,
    label: "홈",
  },
  {
    path: "/rank",
    icon: <StackedLineChartIcon />,
    label: "순위",
  },
  {
    path: "/point",
    icon: <AttachMoneyIcon />,
    label: "포인트",
  },
].map((value, index) => {
  return { ...value, index };
});

export default function BottomNav() {
  const location = useLocation();

  return (
    <BottomNavigation
      showLabels
      className={tabBarStyle}
      value={tabBarRoutes.findIndex((value) => value.path == location.pathname)}
    >
      {tabBarRoutes.map((value) => (
        <BottomNavigationAction
          key={value.path.slice(1, -1)}
          label={value.label}
          icon={value.icon}
          component={Link}
          to={value.path}
        />
      ))}
    </BottomNavigation>
  );
}
