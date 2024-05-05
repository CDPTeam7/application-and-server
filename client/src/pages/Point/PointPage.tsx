import { ThemeSheet } from "../../theme/ThemeSheet";
import useAuthStore from "../../stores/useAuthStore";
import { Navigate } from "react-router-dom";
import { List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PageCardDivider from "@/components/common/PageCardDivider";
import { stringifyNumber } from "@/utils/utility";
import SubPage from "@/components/SubPage";
import ListItem from "@/components/common/ListItem";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
import { usePoint } from "@/hooks/usePoint";
import { css } from "@linaria/core";
import { lightGreen } from "@mui/material/colors";

interface Column {
  id: "date" | "place" | "point";
  label: string;
  maxWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const wrapStyle = css`
  & .checkMore {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${ThemeSheet.Branded[400]};
    cursor: pointer;
  }
  & .monthDivider {
    color: ${ThemeSheet.Gray[400]};
    padding-top: 8px;
  }
`;

export default function PointPage() {
  const { point, fetchPoint, getCurrentPoint } = usePoint();

  const pointNode: React.ReactNode[] = [];

  point.forEach((value, idx, arr) => {
    let curDate: Date | undefined = new Date(value.date);

    if (idx == 0) {
      pointNode.push(<div className="monthDivider">{`${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`}</div>);
      pointNode.push(
        <ListItem
          date={curDate}
          title={value.areaName ?? "undefined"}
          description="재활용에 성공했습니다."
          value={stringifyNumber(value.point)}
        />
      );
      return;
    }

    const prevPoint = arr[idx - 1];
    const prevDate = new Date(prevPoint.date);

    if (prevDate.getMonth() !== curDate.getMonth()) {
      pointNode.push(<div className="monthDivider">{`${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`}</div>);
    } else if (prevDate.getDate() === curDate.getDate()) {
      curDate = undefined;
    }

    pointNode.push(
      <ListItem
        date={curDate}
        title={value.areaName ?? "undefined"}
        description="재활용에 성공했습니다."
        value={stringifyNumber(value.point)}
      />
    );
  });

  return (
    <LoginCheckContainer shouldLogin={true}>
      <SubPage title="포인트 조회" className={wrapStyle}>
        <Typography variant="body1" sx={{ color: ThemeSheet.Gray[600] }}>
          현재 포인트
        </Typography>
        <Typography
          variant="body1"
          sx={{ display: "flex", alignItems: "baseline", gap: "3px", fontSize: "27px", fontWeight: 600 }}
        >
          <span style={{ color: lightGreen[700] }}>{stringifyNumber(getCurrentPoint())}</span> 원
        </Typography>
        <PageCardDivider />

        {pointNode}

        <div className="checkMore" onClick={() => fetchPoint(point.length, point.length + 5)}>
          5개 더 확인하기
        </div>
      </SubPage>
    </LoginCheckContainer>
  );
}
