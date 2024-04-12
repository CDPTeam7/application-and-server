import { css } from "@linaria/core";
import { ThemeSheet } from "../theme/ThemeSheet";
import useAuthStore from "../store/AuthStore";
import { Navigate } from "react-router-dom";
import { Card, CardContent, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { PageContainer } from "../components/common/PageContainer";

const cardStyle = css`
  margin:1rem;
  & > :not(style) {
    margin:1rem;
  }
`;

export default function PointsPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  
  if (!isLoggedIn) {
    return <Navigate replace to="/login" />;
  }

// view 구현용 데모 데이터 입니다. 실제 Data 는 비즈니스 로직과 함께 따로 구분할 예정입닏.ㅏ
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  interface Column {
    id: "date" | "place" | "points";
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
  }

  const columns: readonly Column[] = [
    { id: "date", label: '일시' },
    { id: 'place', align:"right", label: '수거\u00a0장소' },
    {
      id: 'points',
      label: '획득 포인트',
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    }
  ];

  
  const rows = [
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
    { date: new Date(), place:"대구 달서구", points:100},
  ];

  return (
    <PageContainer>
      <Card
        variant="elevation"
        elevation={1}
      >
        <CardContent>
          <Typography variant="h5" margin={1}>포인트 조회</Typography>
          <Typography variant="subtitle1" sx={{display:"flex", alignItems:"center", m:1, gap:"1rem"}}>
            <Typography variant="body1">
              <p>
                <Typography variant="body1">현재 포인트</Typography>
                <span style={{color:ThemeSheet.Branded[400],fontSize:"1.4rem"}}>{1000}</span> 원
              </p>
            </Typography>
          </Typography>
          <TableContainer sx={{ maxHeight: 440, '&::-webkit-scrollbar': {display: "none"} }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {typeof value === "object" ? `${value.getMonth() + 1}.${value.getDate()}` : value.toString()}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
