import BrandLogo from "/title.svg";

export interface IconProps {
  className?:string,
  style?:React.CSSProperties,
}

export default function Icon(props:IconProps) {
  return <img style={props.style} className={props.className ?? ""} src={BrandLogo} alt="" />
}