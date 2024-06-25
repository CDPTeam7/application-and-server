import {css} from "@linaria/core";
import { ThemeSheet } from "../../theme/ThemeSheet";

const buttonStyle = css`
  position:relative;
  outline:none;
  border:none;
  cursor:pointer;
  background:${ThemeSheet.Branded[200]};
  transition:${ThemeSheet.Animation.Transition};
  padding:0.8rem 0.4rem;
  font-size:1rem;
  color:${ThemeSheet.Gray[800]};
  font-weight:700;
  border-radius:0.7rem;

  &:active {
    background:${ThemeSheet.Branded[300]};
  }
`;

const subColor = css`
  background: ${ThemeSheet.Gray[200]};
  &:active {
    background: ${ThemeSheet.Gray[300]};
  }
`;


interface ButtonProps {
  children:React.ReactNode,
  className?:string,
  type?:"sub"
  onClick?:React.MouseEventHandler<HTMLButtonElement>
}

export default function Button(props:ButtonProps) {
  return <button type="button" onClick={props.onClick} className={`${buttonStyle} ${props.className ? props.className : ""} ${props.type == "sub" ? subColor : ""}`}>
    {props.children}
  </button>
}

