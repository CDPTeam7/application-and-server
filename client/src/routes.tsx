import { MainPage, LoginPage, SignupPage, ProfilePage } from "@/pages";
import RankingPage from "./pages/Ranking";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotificationsPage from "./pages/Notification/NotificationPage";
import PointPage from "./pages/Point/PointPage";
import ProfileEdit from "./pages/Profile/ProfileEdit";

export const routes: RouteObject[] = [
  {
    id: "홈",
    path: "/",
    element: <MainPage />,
  },
  {
    id: "로그인",
    path: "/login",
    element: <LoginPage />,
  },
  {
    id: "회원가입",
    path: "/signup",
    element: <SignupPage />,
  },
  {
    id: "프로필",
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    id: "프로필 수정",
    path: "/profile/edit",
    element: <ProfileEdit />,
  },
  {
    id: "알림",
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    id: "포인트",
    path: "/point",
    element: <PointPage />,
  },
  {
    id: "순위",
    path: "/ranking?/:ID",
    element: <RankingPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes,
  },
]);
