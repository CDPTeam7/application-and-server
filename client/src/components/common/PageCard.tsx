import { css } from "@linaria/core"
import { Card, CardContent } from "@mui/material"

export interface PageCardProps {
  children: React.ReactNode
  className?: string
}

const contentStyle = css`
  border-top-left-radius:30px !important;
  border-top-right-radius:30px !important;
  min-height:calc(100vh - 160px) !important;
`;

export default function PageCard(props:PageCardProps) {
  return <Card variant="elevation" elevation={0} className={contentStyle}>
    <CardContent className={`${props.className} ${contentStyle}`}>
      {props.children}
    </CardContent>
  </Card>
}