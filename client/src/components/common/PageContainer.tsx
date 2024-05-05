import { css } from "@linaria/core"
import { Box } from "@mui/material"
import React from "react"

export interface PageContainerProps {  
  children: React.ReactNode
  style?:React.CSSProperties,
  className?:string
}

const containerStyle = css`
  @keyframes show-up {
    0% {
      opacity:0.2;
      left:30px;
    }
    100% {
      opacity:1;
      left:0;
    }
  }
  position:relative;
  padding-top:72px;
  margin-top: 0;
  min-width: 100vw;
  padding-bottom:56px;
  animation:show-up 200ms ease;
`

export const PageContainer = (props:PageContainerProps) => {
  return <Box className={`${props.className ?? ""} ${containerStyle} `} style={props.style}>
    {props.children}
  </Box>
}