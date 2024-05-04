import { ThemeSheet } from "@/theme/ThemeSheet";
import { css } from "@linaria/core";
import { Button, SvgIconTypeMap, Typography } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

interface CardContentProps {
  icon: OverridableComponent<SvgIconTypeMap> & { muiName: string };
  title: string;
  subtitle?: string;
  navigateTo?: string;
}

export default function CardContent(props: CardContentProps) {
  const navigate = useNavigate();
  const Icon = props.icon;
  const myProfileStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    & .content {
      display: flex;
      align-items: center;
      & .icon {
        color: ${ThemeSheet.Gray[400]};
        width: 48px;
        height: 48px;
        margin-right: 16px;
      }
    }
    & button {
      min-width: 0 !important;
      border-radius: 50%;
    }
  `;
  return (
    <>
      <div className={myProfileStyle}>
        <div className="content">
          <Icon className="icon" />
          <div>
            {props.subtitle !== undefined ? <Typography variant="subtitle2">{props.subtitle}</Typography> : null}
            <Typography variant="h6">{props.title}</Typography>
          </div>
        </div>

        {props.navigateTo !== undefined ? (
          <Button onClick={() => navigate(props.navigateTo)}>
            <ArrowForwardIosIcon />
          </Button>
        ) : null}
      </div>
    </>
  );
}
