import {css} from "@linaria/core";
import { ThemeSheet } from "../../theme/ThemeSheet";

const titleStyle = css`
  font-size: 1.8rem;
  font-weight:600;
  margin-bottom: 2.8rem;
  & div {
    margin-top:0.3rem;
    font-size:1rem;
    font-weight:200;
    color:${ThemeSheet.Gray[500]};
  }
`;

export interface TitleProps {
  title:string
  subtitle?:string
  className?:string
}

export default function Title(props:TitleProps){
  return <h1 className={`${props.className} ${titleStyle}`}>
    <span>
      {props.title}
    </span>
    <div>
      {props.subtitle ?? " "}
    </div>
  </h1>
}