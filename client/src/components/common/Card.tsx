import { css } from "@linaria/core";
import { Card as MUICard, CardContent as MUICardContent } from "@mui/material";
import React from "react";

const cardStyle = css`
  border-radius: 24px !important;
`;

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Card(props: CardProps) {
  return (
    <MUICard variant="outlined" className={`${cardStyle} ${props.className}`}>
      <MUICardContent>{props.children}</MUICardContent>
    </MUICard>
  );
}
