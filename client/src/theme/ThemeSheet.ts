import { StyleSheet } from "./StyleScheme";

export const ThemeSheet:StyleSheet = {
  White: "#ffffff",
  Black: "#000000",
  Gray: {
    100: "#EAEEF0",
    200: "#D2D7D9",
    300: "#BCC0C2",
    400: "#A9ADAF",
    500: "#8F9294",
    600: "#737779",
    700: "#5D6164",
    800: "#494A4A",
    900: "#343637"
  },
  Branded: {
    100: "#C2F7C4",
    200: "#81EC85",
    300: "#56DC5C",
    400: "#35C63B",
    500: "#25A92B",
    600: "#258C29",
    700: "#1A6F1D",
    800: "#0E4C11",
    900: "#063008"
  },
  Blue: {
    100: "#dbdcff",
    200: "#b9bbfa",
    300: "#a2a4fc",
    400: "#8183fc",
    500: "#6668ff",
    600: "#3d40ff",
    700: "#161afa",
    800: "#0b0ed4",
    900: "#02047d"
  },
  Red: {
    100: "#ffc9c9",
    200: "#f5b8b8",
    300: "#eb9898",
    400: "#de6464",
    500: "#e33636",
    600: "#d41c1c",
    700: "#b30b0b",
    800: "#870404",
    900: "#540101"
  },
  Size:{
    Title:"1.75rem",
    Desc:"1.5rem",
    Article:"1.2rem",
  },
  Animation: {
    Transition:"color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;"
  }
}