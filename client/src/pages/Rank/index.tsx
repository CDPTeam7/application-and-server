import PersonalRank from "./TopRank";
import PageCardDivider from "@/components/common/PageCardDivider";
import SubPage from "@/components/SubPage";
import { css } from "@linaria/core";
import LoginCheckContainer from "@/containers/LoginCheckContainer";
import { useRank } from "@/hooks/useRank";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { usePoint } from "@/hooks/usePoint";
import Deriv from "@/components/common/Deriv";
import { stringifyNumber } from "@/utils/utility";

const tabStyle = css`
  width: auto;
  & button {
    font-size: 18px !important;
  }
`;

export default function RankingPage() {
  const { setRankType, rankType, myRank, deriv, topRank } = useRank();
  const { getCurrentPoint } = usePoint();
  // console.log(myRank);
  return (
    <LoginCheckContainer shouldLogin={true}>
      <SubPage title="순위">
        <Tabs
          className={tabStyle}
          value={rankType}
          onChange={(_e, value) => setRankType(value)}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab value="all" label="전체 랭킹" />
          <Tab value="region" label="시 랭킹" />
          <Tab value="area" label="구 랭킹" />
        </Tabs>
        <PageCardDivider style={{ height: "2px", margin: 0 }} />
        <Box sx={{ my: "16px" }}>
          <Typography variant="subtitle2">내 순위</Typography>
          <Typography variant="h6" sx={{ fontSize: "1.5rem", marginBottom: "8px" }}>
            {myRank} 위
            <Deriv deriv={deriv - myRank} />
          </Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: "16px" }}>
            {stringifyNumber(getCurrentPoint())} 점
          </Typography>
        </Box>
        <PersonalRank topRank={topRank} />
      </SubPage>
    </LoginCheckContainer>
  );
}
