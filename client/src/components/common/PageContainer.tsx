import { css } from "@linaria/core"
import { Box } from "@mui/material"
import React from "react"

export interface PageContainerProps {  
  children: React.ReactNode
  style?:React.CSSProperties,
  className?:string
}

const containerStyle = css`
  margin-top:calc(56px + 3rem);
  min-width: 100vw;
  padding-bottom:56px;
`

export const PageContainer = (props:PageContainerProps) => {
  return <Box className={`${props.className ?? ""} ${containerStyle} `} style={props.style}>
    {props.children}
  </Box>
}