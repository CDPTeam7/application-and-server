import { css } from "@linaria/core";
import Icon from "../components/common/Icon";
import BackgroundOverlay from "../components/BackgroundOverlay";
import Title from "../components/common/Title";
import { ThemeSheet } from "../theme/ThemeSheet";
import Container from "../components/common/Container";
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

const titleStyle = css`
  font-size: 1.5rem;
`

const myProfileStyle = css`
  & > div {
    display:flex;
    gap:1.5rem;

    font-size:1.2rem;
    & > svg {
      color:${ThemeSheet.Branded[400]};
    }
    & span {
      color:${ThemeSheet.Branded[400]};
    }
  }
`

export default function MainPage() {
  return (
    <div>
      <BackgroundOverlay />
      <Icon />
      <Container>
          <Title className={titleStyle} title="내 정보" subtitle="내 정보를 확인할 수 있어요." />
          <div className={myProfileStyle}>
            <div>
              <EnergySavingsLeafIcon />
              <div>
                재활용 <span>{10}</span> 일째
              </div>
            </div>
          </div>
        
      </Container>
      <Container>
        <Title className={titleStyle} title="나의 탄소중립실천포인트" subtitle="페트병을 재활용하고 환경보호에 실천해요!" />
        <div>
          현재 {1000} 원 모았어요.
        </div>
      </Container>
      <Container>
        <Title title="우리 지역 재활용 순위" subtitle="재활용 실천을 다같이 해보아요!" className={titleStyle} />
      </Container>
    </div>
  );
}
