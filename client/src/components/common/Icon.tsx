import { css } from "@linaria/core";
import BrandLogo from "/BrandLogo.png";

const iconStyle = css`
  margin:4rem 1rem 2.5rem;
`

export default function Icon() {
  return <div className={iconStyle}>
    <img src={BrandLogo} alt="" />
  </div>
}