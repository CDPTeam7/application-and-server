import { stringifyNumber } from "@/utils/utility";
// import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import ListItem from "./ListItem";

export function createRankRow(nickname: string, areaName: string, point: number, derivation: number) {
  return { nickname, areaName, point, derivation };
}

interface TableProps {
  rows: Array<{
    areaName: string;
    nickname: string;
    point: number;
    derivation: number;
  }>;
}

export default function RankTable(props: TableProps) {
  const { rows } = props;
  return rows.map((value, index) => (
    <div>
      <ListItem
        date={`${index + 1}위`}
        title={value.nickname}
        description={value.areaName}
        value={stringifyNumber(value.point)}
        deriv={value.derivation}
      />
    </div>
  ));
  // return (
  //   <TableContainer>
  //     <Table sx={{ maxWidth: "100%" }} aria-label="simple table">
  //       <TableBody>
  //         {rows.map((row, index) => (
  //           <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
  //             <TableCell component="th" scope="row">
  //               {index + 1}
  //             </TableCell>
  //             <TableCell align="right">{row.areaName}</TableCell>
  //             <TableCell align="right" sx={{ color: row.derivation > 0 ? "red" : "blue" }}>
  //               {stringifyNumber(row.point)}
  //               {`(${row.derivation > 0 ? "▲" : row.derivation == 0 ? "" : "▼"}${Math.abs(row.derivation)})`}
  //             </TableCell>
  //           </TableRow>
  //         ))}
  //       </TableBody>
  //     </Table>
  //   </TableContainer>
  // );
}
