import { css } from "@linaria/core";
import { ThemeSheet } from "../../theme/ThemeSheet";

export interface ContainerProps {
  className?:string
  children?:React.ReactNode
  onKeyDown?:React.KeyboardEventHandler<HTMLDivElement>
}

const cardStyle = css`
  margin:1rem 1rem 0rem;
  padding:1.5rem 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,.1);
  background:${ThemeSheet.White};
  border-radius:1rem;
  & > * {
    margin-bottom:2rem;
  }
`;

export default function Container(props:ContainerProps) {
  return <div className={`${props.className ?? ""} ${cardStyle}`} onKeyDown={props.onKeyDown}>
    {props.children}
  </div>
}