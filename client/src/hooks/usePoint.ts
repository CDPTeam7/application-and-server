import { requestPointByCount } from "@/api";
import { PointRecord } from "@/types/PointRecord";
import { useEffect, useState } from "react";

export const usePoint = () => {
  const [point, setPoint] = useState<PointRecord[]>([]);

  const fetchPoint = async (from: number, count: number) => {
    try {
      const result = await requestPointByCount(from, count);
      // API 에서 가져오는 결과 타입으로 수정하기
      result.data.data.forEach((value) => {
        if (value)
          point.push({
            transactionID: value.transactionID,
            areaName: `${value.regionName} ${value.areaName}`,
            date: new Date(value.date),
            point: value.point,
            afterTotal: value.after_total,
          });
      });
      setPoint([...point]);
    } catch (e) {
      setPoint([]);
    }
  };

  const getCurrentPoint = () => {
    if (point.length === 0) return 0;
    console.log(point);
    return point[0].afterTotal ?? 0;
  };

  useEffect(() => {
    fetchPoint(0, 5);
  }, []);

  return { point, fetchPoint, getCurrentPoint };
};
