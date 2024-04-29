import { css } from "@linaria/core";
import { ThemeSheet } from "../theme/ThemeSheet";
import useAuthStore from "../store/AuthStore";
import { Navigate } from "react-router-dom";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PageContainer } from "../components/common/PageContainer";
import PageCard from "../components/common/PageCard";
import { useUserStore } from "@/store/UserStore";
import { PointRecord } from "@/api/point";

const cardStyle = css`
  margin:1rem;
`

interface Column {
  id: "date" | "place" | "point";
  label: string;
  maxWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "date", label: "일시", align:"right", maxWidth:50},
  { id: "place", align: "right", label: "수거 장소" },
  {
    id: "point",
    label: "획득 포인트",
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
];

export default function PointPage() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const requestPoint = useUserStore(state => state.requestPointByCount);

  const [rows, setRows] = useState<PointRecord[]>([]);

  useEffect(() => {
    requestPoint(0, 10)
    .then(records => {
      console.log(records);
      setRows(records);
    })
  }, []);

  if (!isAuth) {
    return <Navigate replace to="/login" />;
  }

  return (
    <PageContainer>
      <PageCard className={cardStyle}>
        <Typography variant="h5" sx={{marginBottom:"16px"}}>
          포인트 조회
        </Typography>
        <Typography variant="body1" sx={{color:ThemeSheet.Gray[600]}}>현재 포인트</Typography>
        <Typography
          variant="body1"
          sx={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
              <span
                style={{ color: ThemeSheet.Branded[400], fontSize: "1.4rem" }}
              >
                {rows[0]?.afterTotal}
              </span>{" "}
              원
        </Typography>
        <Divider sx={{marginY:"16px"}}/>
        <TableContainer sx={{borderRadius:"12px"}}>
          <Table aria-label="table" >
            <TableHead sx={{background:"#e7f5ea"}}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                rows.length === 0 ? 
                <TableRow>
                  <TableCell>
                    
                  </TableCell>
                  <TableCell align="right">
                    최근 이력이 없습니다!
                  </TableCell>
                  <TableCell>

                  </TableCell>
                </TableRow>
                : rows.map((row, idx) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id == "date" ? `${new Date(value).getFullYear()}. ${new Date(value).getMonth() + 1}.${new Date(value).getDate() }` : value }
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </PageCard>
    </PageContainer>
  );
}
