import { ThemeSheet } from "../../theme/ThemeSheet";
import useAuthStore from "../../stores/useAuthStore";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PageCardDivider from "@/components/common/PageCardDivider";
import { stringifyNumber } from "@/utils/utility";
import SubPage from "@/components/SubPage";
import ListItem from "@/components/common/ListItem";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
import { usePoint } from "@/hooks/usePoint";

interface Column {
  id: "date" | "place" | "point";
  label: string;
  maxWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

export default function PointPage() {
  const { point, fetchPoint, getCurrentPoint } = usePoint();

  return (
    <LoginCheckContainer shouldLogin={true}>
      <SubPage title="포인트 조회">
        <Typography variant="body1" sx={{ color: ThemeSheet.Gray[600] }}>
          현재 포인트
        </Typography>
        <Typography
          variant="body1"
          sx={{ display: "flex", alignItems: "baseline", gap: "3px", fontSize: "27px", fontWeight: 600 }}
        >
          <span style={{ color: ThemeSheet.Branded[500] }}>{stringifyNumber(getCurrentPoint())}</span> 원
        </Typography>
        <PageCardDivider />

        {point.map((value, index, arr) => {
          const prev = arr[index - 1];
          let date;
          if (prev === undefined) {
            date = new Date(value.date);
          } else date = prev.date !== value.date ? new Date(value.date) : undefined;
          // transaction type 을 정의해서 포인트를 어떻게 모으고 사용했는지를 표시할 수 있도록 해야한다.
          return <ListItem key={index} date={date} title={value.areaName} value={`${stringifyNumber(value.point)} 원`} />;
        })}
        <div> 5개 더 확인하기</div>
      </SubPage>
    </LoginCheckContainer>
  );
}
