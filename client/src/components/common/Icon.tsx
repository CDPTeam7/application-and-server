import BrandLogo from "/BrandLogo.png";

export interface IconProps {
  className?:string,
  style?:React.CSSProperties,
}

export default function Icon(props:IconProps) {
  return <img style={props.style} className={props.className ?? ""} src={BrandLogo} alt="" />
}