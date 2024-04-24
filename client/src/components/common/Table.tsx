import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { stringifyNumber } from "../../utility";

function createData(
  rank: number,
  areaName: string,
  point: number,
  derivation: number
) {
  return { rank, areaName, point, derivation };
}

const rows = [
  createData(1, "그냥 대구", 12123123, 10),
  createData(1, "낭만 대구", 12123123, 10),
  createData(1, "낭만없는 대구", 12123123, -10),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ maxWidth: "100%" }} aria-label="simple table">
        {/* <TableHead sx={{ background: "#f3f3f3" }}>
          <TableRow>
            <TableCell>순위</TableCell>
            <TableCell align="right">지역 이름</TableCell>
            <TableCell align="right">점수</TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.areaName}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.rank}
              </TableCell>
              <TableCell align="right">{row.areaName}</TableCell>
              <TableCell
                align="right"
                sx={{ color: row.derivation > 0 ? "red" : "blue" }}
              >
                {stringifyNumber(row.point)}
                {`(${row.derivation > 0 ? '▲' : (row.derivation == 0 ? '' : "▼")}${Math.abs(row.derivation)})`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
