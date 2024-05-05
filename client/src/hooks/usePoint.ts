import { requestPointByCount } from "@/api";
import { PointRecord } from "@/types/PointRecord";
import { useEffect, useState } from "react";

/**
 * 백엔드에 맞춘 타입입니다. API 결과와 동일해야합니다.
 */
interface APIPointRecord {
  after_total: number;
  date: string;
  areaName: string | undefined;
  point: number;
}

export const usePoint = () => {
  const [point, setPoint] = useState<PointRecord[]>([]);

  const fetchPoint = async (from: number, count: number): Promise<PointRecord[]> => {
    try {
      const result = await requestPointByCount(from, count);
      // API 에서 가져오는 결과 타입으로 수정하기
      return result.data.data.map((value: APIPointRecord) => {
        if (value)
          return {
            transactionID: "NONE",
            areaName: value.areaName ?? "어딘가",
            date: new Date(value.date),
            place: "unknown",
            point: value.point,
            afterTotal: value.after_total,
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
