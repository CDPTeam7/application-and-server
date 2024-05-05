import { css } from "@linaria/core";
import useAuthStore from "@/stores/useAuthStore";
import { Navigate } from "react-router-dom";
import { Box, Divider, ListItem, ListItemAvatar, ListItemText, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import BasicTable, { createRankRow } from "@/components/common/RankTable";
import AreaSelect from "./AreaSelect";
import PageCardDivider from "@/components/common/PageCardDivider";

const myAreaStyle = css`
  background: #e7f5ea;
  border-radius: 12px;
  padding: 6px;
`;

const tabStyle = css`
  flex-wrap: wrap;
  & * {
    flex: 1;
  }
`;

export default function RankPage() {
  const [value, setTabState] = useState("rank");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabState(newValue);
  };

  return (
    <>
      <Box sx={{ my: "16px" }}>
        <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          우리지역 순위
        </Typography>
        <ListItem key={1} component="div" className={myAreaStyle} secondaryAction={123}>
          <ListItemAvatar>1</ListItemAvatar>
          <ListItemText primary={`대구`} />
        </ListItem>
      </Box>
      <PageCardDivider style={{ marginBottom: "16px" }} />
      <Typography variant="h6" sx={{ marginBottom: "16px" }}>
        다른 지역 정보
      </Typography>
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tabs value={value} onChange={handleTabChange} textColor="primary" indicatorColor="primary" className={tabStyle}>
          <Tab value="rank" label="랭킹 조회" />
          <Tab value="other" label="다른 지역 보기" />
        </Tabs>

        {value == "other" ? <AreaSelect /> : <BasicTable rows={[createRankRow("대구", 100, 10)]} />}
      </Box>
    </>
  );
}
