import { css } from "@linaria/core";
import { Box, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import BasicTable, { createRankRow } from "../../components/common/RankTable";
import PageCardDivider from "@/components/common/PageCardDivider";

const myAreaStyle = css`
  background: #e7f5ea;
  border-radius: 12px;
  padding: 6px;
`;

export default function PersonalRank() {
  return (
    <>
      <Box sx={{ my: "16px" }}>
        <Typography variant="subtitle2">내 순위</Typography>
        <Typography variant="h6" sx={{ fontSize: "1.5rem", marginBottom: "8px" }}>
          123 위
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: "16px" }}>
          1 점
        </Typography>
      </Box>
      <PageCardDivider style={{ marginTop: 0, marginBottom: "16px" }} />
      <Typography variant="h6" sx={{ marginBottom: "16px" }}>
        최다 점수
      </Typography>
      <BasicTable rows={[createRankRow("대구", 100, 10)]} />
    </>
  );
}
