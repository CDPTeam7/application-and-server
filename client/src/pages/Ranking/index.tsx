import AreaRank from "./AreaRank";
import PersonalRank from "./PersonalRank";
import PageCardDivider from "@/components/common/PageCardDivider";
import SubPage from "@/components/SubPage";
import { useState } from "react";
import { css } from "@linaria/core";
import LoginCheckContainer from "@/containers/LoginCheckContainer";

const barStyle = css`
  display: flex;
  justify-content: space-around;
  margin-top: 22px;
  font-size: 22px;
  font-weight: 600;
  & > div {
    padding-bottom: 6px;
  }
  & > div.selected {
    border-bottom: 2px solid #000000;
  }
`;

export default function RankingPage() {
  const [index, setIndex] = useState(0);
  const key = [0, 1];
  return (
    <LoginCheckContainer shouldLogin={true}>
      <SubPage title="순위">
        <div className={barStyle}>
          <div onClick={() => setIndex(0)} className={`${key[index] == 0 ? "selected" : ""}`}>
            지역 순위
          </div>
          <div onClick={() => setIndex(1)} className={`${key[index] == 1 ? "selected" : ""}`}>
            개인 순위
          </div>
        </div>
        <PageCardDivider style={{ height: "2px", margin: 0 }} />
        {index === 0 ? <AreaRank /> : <PersonalRank />}
      </SubPage>
    </LoginCheckContainer>
  );
}
