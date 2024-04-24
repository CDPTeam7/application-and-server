import { useLocation, useOutlet } from "react-router-dom";
import { green } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material";
import { CookiesProvider } from "react-cookie";
import BottomNav from "./components/BottomNav";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import useAuthStore from "./store/AuthStore";
import NavBar from "./components/NavBar";
import { useEffect } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
  },
});

function App() {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const isAuth = useAuthStore((state) => state.isAuth);
  const checkToken = useAuthStore((state) => state.checkToken);

  useEffect(() => {
    checkToken();
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        {/* transition group 을 통해 slide page transition 을 하고 싶지만 시간이 없었습니다, */}
        {isAuth ? <NavBar /> : null}
        <TransitionGroup className="transition-group">
          <CSSTransition key={location.key} classNames="page-animation" timeout={0}>
            {currentOutlet}
          </CSSTransition>
        </TransitionGroup>
        {isAuth ? <BottomNav /> : null}
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;
