import {css} from "@linaria/core";
import { ThemeSheet } from "../theme/ThemeSheet";

const navBarStyle = css`
  font-size:${ThemeSheet.Size.Title};
  display:block;
  position:absolute;
  opacity:0;
  top:0;
  right:0;
  left:0;
  color:${ThemeSheet.Black};
  box-shadow:0 4px 18px 0 rgba(0,0,0,.08);
`;

export interface NavBarProps {
  children?:React.ReactNode,
  className?:string
}

export default function NavBar(props:NavBarProps){
  return <div className={`${props.className} ${navBarStyle}`}>
    {props.children}test
  </div>
}