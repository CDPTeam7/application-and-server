import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import useAuthStore from "./store/AuthStore";
import TabBar from "./components/TabBar";
import NavBar from "./components/NavBar";
import { TransitionGroup, CSSTransition, } from "react-transition-group";
import Spinner from 'react-bootstrap/Spinner';
import { css } from "@linaria/core";
import { useTimeout } from "./hooks/useTimeout";
import { useState } from "react";
import SignupPage from "./pages/SignupPage";
import RankPage from "./pages/RankPage";

const fadeOutAnimation = css`
  position: fixed;
  background-color:white;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  transition: all 200ms ease;
  & > * {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -15px;
  }
`

const hidePreload = css`
  opacity:0;
  pointer-events:none;
`

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); // 클라이언트의 로그인 여부를 어딘가에서 가져온다고 가정
  const [preload, setPreload] = useState<boolean>(true);
  const location = useLocation();
  console.log(isLoggedIn);
  useTimeout(() => {
    // 무언가의 로딩이 다 되었을 때 호출
    setPreload(false);
  }, 200);
  return (
    <div>
      <div className={`${fadeOutAnimation} ${!preload ? hidePreload : ""}`}>
        <Spinner animation="border" role="status" />
      </div>
      <NavBar />
        <TransitionGroup>
          <CSSTransition timeout={300} classNames="fade">
            <Routes>
              <Route
                path="/"
                element={isLoggedIn ? <MainPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/ranks"
                element={isLoggedIn ? <RankPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
              />
              <Route
                path="/signup"
                element={<SignupPage />}
              />
              <Route
                path="*"
                element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />}
              />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
      {location.pathname !== "/login" && location.pathname !== "/signup" ? <TabBar /> : null}
    </div>
  );
}

export default App;
