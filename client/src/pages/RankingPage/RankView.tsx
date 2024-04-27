import { css } from "@linaria/core";
import useAuthStore from "../../store/AuthStore";
import { Navigate } from "react-router-dom";
import {
  Box,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { PageContainer } from "../../components/common/PageContainer";
import PageCard from "../../components/common/PageCard";
import BasicTable from "../../components/common/Table";
import AreaSelect from "./AreaSelect";

const cardStyle = css`
  margin: 1rem;
  display:flex;
  flex-direction:column;
`;

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
  const isAuth = useAuthStore((state) => state.isAuth);

  if (!isAuth) {
    return <Navigate replace to="/login" />;
  }
  
  const [value, setTabState] = useState("rank");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabState(newValue);
  };

  return (
    <PageContainer>
      <PageCard className={cardStyle}>
        <Typography variant="h5" sx={{ marginBottom: "16px" }}>
          순위
        </Typography>
        <Box sx={{marginBottom:"16px"}}>
          <Typography variant="subtitle1" sx={{ marginBottom: "16px" }}>우리지역 순위</Typography>
          <ListItem
            key={1}
            component="div"
            className={myAreaStyle}
            secondaryAction={123}
          >
            <ListItemAvatar>1</ListItemAvatar>
            <ListItemText primary={`대구`} />
          </ListItem>
        </Box>
        <Divider sx={{ marginBottom: "16px" }}/>
        <Typography variant="subtitle1" sx={{ marginBottom: "16px" }}>
          다른 지역 순위
        </Typography>
        <Box sx={{ width: "100%", flexGrow:1, display:"flex",flexDirection:"column"}}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            className={tabStyle}
          >
            <Tab value="rank" label="랭킹 조회" />
            <Tab value="other" label="다른 지역 보기" />
          </Tabs>
        
          {value == "other" ? <AreaSelect /> : <BasicTable />}
        </Box>
      </PageCard>
    </PageContainer>
  );
}
