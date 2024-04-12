import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import { createRef } from "react";
import SignupPage from "./pages/SignupPage";
import RanksPage from "./pages/RanksPage";
import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import PointsPage from "./pages/PointsPage";

export interface TransitionRoute {
  path: string,
  name: string,
  element: React.ReactNode,
  nodeRef: React.RefObject<unknown>
}

export const routes:TransitionRoute[] = [
  {
    path: "/",
    name: "Home",
    element: <MainPage />,
    nodeRef:createRef(),
  },
  {
    path: "/login",
    name: "Login",
    element: <LoginPage />,
    nodeRef:createRef(),
  },
  {
    path:"/signup",
    name:"Sign up",
    element:<SignupPage />,
    nodeRef:createRef(),
  },
  {
    path: "/profile",
    name: "Profile",
    element: <ProfilePage />,
    nodeRef:createRef(),
  },
  {
    path: "/notifications",
    name: "Notifications",
    element: <NotificationsPage />,
    nodeRef:createRef(),
  },
  {
    path: "/points",
    name: "Points",
    element: <PointsPage />,
    nodeRef:createRef(),
  },
  {
    path: "/ranks",
    name: "Ranks",
    element: <RanksPage />,
    nodeRef: createRef(),
  },
  {
    path: "*",
    element: <Navigate replace to="/" />,
    name: "",
    nodeRef: createRef(),
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes.map((route) => ({
      index: route.path === '/',
      path: route.path === '/' ? undefined : route.path,
      element: route.element,
    })),
  },
])