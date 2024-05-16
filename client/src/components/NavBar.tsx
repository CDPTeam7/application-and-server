import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { css } from "@linaria/core";
import { routes } from "@/routes";

const toolbarStyle = css`
  position: relative;
  & > * {
    position: absolute;
  }
  display: block !important;
`;

const menuNameStyle = css`
  left: 50%;
  top: 50%;
  font-weight: 600;
  transform: translateX(-50%) translateY(-50%);
`;

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          background: "white",
          boxShadow: 0,
          backdropFilter: "blur(16px)",
        }}
      >
        <Toolbar className={toolbarStyle}>
          {location.pathname !== "/" ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ position: "absolute", top: "50%", left: "30px", transform: "translateY(-50%)" }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
            ""
          )}
          <div className={menuNameStyle}>{routes.filter((route) => route.path?.startsWith(location.pathname))[0].id}</div>
          <div />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
