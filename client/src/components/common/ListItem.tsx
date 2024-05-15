import { ThemeSheet } from "@/theme/ThemeSheet";
import { css } from "@linaria/core";
import Deriv from "./Deriv";

const wrapStyle = css`
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 0;
  & .date {
    width: 100px;
  }
  & .content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & .content .article {
    display: flex;
    flex-direction: column;
    gap: 6px;
    & .title {
      font-size: 20px;
      font-weight: 500;
    }
    & .desc {
      font-size: 16px;
      font-weight: 300;
      color: ${ThemeSheet.Gray[400]};
    }
  }
`;

interface ListItemProps {
  date?: string;
  title: string;
  description?: string;
  value: string;
  valueClass?: string;
  className?: string;
  deriv?: number;
}

/**
 * 연도는 보여주지 않고 날짜만 표시된다.
 */
export default function ListItem(props: ListItemProps) {
  return (
    <div className={`${wrapStyle} ${props.className}`}>
      <div className="date">{props.date ? props.date : null}</div>
      <div className="content">
        <div className="article">
          <div className="title">{props.title}</div>
          {props.description ? <div className="desc">{props.description}</div> : null}
        </div>
        <div className={`value ${props.valueClass}`}>{props.value}</div>
      </div>
      {props.deriv !== undefined ? <Deriv deriv={props.deriv} /> : null}
    </div>
  );
}
