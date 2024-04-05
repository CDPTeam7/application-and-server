import { css } from "@linaria/core"
import { ThemeSheet } from "../theme/ThemeSheet"

const wrapStyle = css`
  position:absolute;
  top:0;
  right:0;
  left:0;
  height:210px;
  z-index:-1;

  border-bottom-left-radius:5rem;
  border-bottom-right-radius:5rem;
  background:${ThemeSheet.Branded[200]};
`

export default function BackgroundOverlay () {
  return <div className={wrapStyle}>
    
  </div>
}