import { useLocation, useOutlet } from "react-router-dom";
import { green } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material";

import BottomNav from "./components/BottomNav";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import useAuthStore from "./store/AuthStore";
import NavBar from "./components/NavBar";

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
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return (
    <ThemeProvider theme={theme}>
      {/* 
        transition group 을 통해 slide page transition 을 하고 싶지만 시간이 없었습니다, */}
      {isLoggedIn ? <NavBar /> : null}
      <TransitionGroup className="transition-group">
        <CSSTransition key={location.key} classNames="page-animation" timeout={30000}>
          {currentOutlet}
        </CSSTransition>
      </TransitionGroup>
      {isLoggedIn ? <BottomNav /> : null}
    </ThemeProvider>
  );
}

export default App;
