import { requestPointByCount } from "@/api";
import { PointRecord } from "@/types/PointRecord";
import { useEffect, useState } from "react";

export const usePoint = () => {
  const [point, setPoint] = useState<PointRecord[]>([]);

  const fetchPoint = async (from: number, count: number): Promise<PointRecord[]> => {
    try {
      const result = await requestPointByCount(from, count);
      // API 에서 가져오는 결과 타입으로 수정하기
      return result.data.data.map((value: PointRecord) => {
        return {
          transactionID: "NONE",
          areaName: value.areaName,
          date: value.date,
          place: "unknown",
          point: value.point,
          afterTotal: value.afterTotal,
        };
      });
    } catch (e) {
      return [];
    }
  };

  const getCurrentPoint = () => {
    if (point.length === 0) return 0;
    console.log(point);
    return point[0].afterTotal ?? 0;
  };

  useEffect(() => {
    fetchPoint(0, 5).then((value) => {
      setPoint(point.concat(value));
    });
  }, []);

  return { point, fetchPoint, getCurrentPoint };
};
