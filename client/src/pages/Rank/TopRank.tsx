import { Typography } from "@mui/material";
import BasicTable from "../../components/common/RankTable";
import PageCardDivider from "@/components/common/PageCardDivider";
import { TopRankRecord } from "@/types/RankRecord";

interface TopRankProps {
  topRank: TopRankRecord[];
}

export default function TopRank(props: TopRankProps) {
  const records = props.topRank;
  return (
    <>
      <PageCardDivider style={{ marginTop: 0, marginBottom: "16px" }} />
      <Typography variant="h6" sx={{ marginBottom: "16px" }}>
        Top 10
      </Typography>
      <BasicTable rows={records} />
    </>
  );
}
