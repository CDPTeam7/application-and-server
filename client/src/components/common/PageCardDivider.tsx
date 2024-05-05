import { css } from "@linaria/core";

const pageCardDividerStyle = css`
  position: relative;
  margin:32px 0;
  left: -32px;
  height: 30px;
  border: none;
  width: 100vw;
  background: #f0f0f0;
`

interface PageCardDividerProps {
  style?:React.CSSProperties
}

export default function PageCardDivider(props:PageCardDividerProps) {
  return <hr className={pageCardDividerStyle} style={props.style}/> 
}

