import { axiosWithCookie } from "@/utils/axios";
import { TOKEN_ACCESS_ID, getCookie } from "@/utils/cookie";

export interface PointRecord {
  afterTotal: number;
  place: string;
  date: string;
  point: number;
}

/**
 * from 으로부터 num 개 까지 포인트내역을 확인합니다.
 * @param from point 배열의 index
 * @param recordCount 가져올 point record의 개수
 */
export function requestPointByCount(from: number, recordCount: number) {
  return axiosWithCookie.post("/api/point/history/count", {
    access_token: getCookie(TOKEN_ACCESS_ID),
    from,
    count: recordCount,
  });
}

export function interval() {
  console.error("api call not implemented");
}
