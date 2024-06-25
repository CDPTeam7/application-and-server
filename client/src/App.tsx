import { lightGreen } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material";
import { CookiesProvider } from "react-cookie";

import AppContainer from "./containers/AppContainer";
import { ThemeSheet } from "./theme/ThemeSheet";

const theme = createTheme({
  typography: {
    fontFamily: "'Noto Sans KR', sans-serif",
    h1: {
      fontSize: "1.6rem",
      fontWeight: "600",
    },
    subtitle2: {
      color: ThemeSheet.Gray[400],
    },
  },
  palette: {
    primary: {
      main: lightGreen[500],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <AppContainer />
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;
