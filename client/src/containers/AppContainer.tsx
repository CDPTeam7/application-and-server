import BottomNav from "@/components/BottomNav";
import NavBar from "@/components/NavBar";
import useAuthStore from "@/stores/useAuthStore";
import { styled } from "@linaria/react";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router-dom";

const Loader = styled.div<{ load: boolean | null }>`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9999;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (!props.load ? 0.8 : 0)};
  pointer-events: none;
  transition: 300ms ease all;
`;

export default function AppContainer() {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const loginState = useAuthStore((state) => state.loginState);
  const checkToken = useAuthStore((state) => state.checkToken);
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    checkToken();
  }, []);

  if (loginState === "pending") {
    return (
      <Loader load={false}>
        <CircularProgress sx={{ width: "60px", height: "60px" }} />
      </Loader>
    );
  }

  return (
    <>
      {location.pathname !== "/login" ? <NavBar /> : null}
      {currentOutlet}
      {currentUser !== null ? <BottomNav /> : null}
    </>
  );
}
