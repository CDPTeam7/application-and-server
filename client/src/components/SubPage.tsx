import PageCard from "@/components/common/PageCard";
import { PageContainer } from "@/components/common/PageContainer";
import { css } from "@linaria/core";
import { Typography } from "@mui/material";

const cardStyle = css`
  margin: 1rem;
  display: flex;
  flex-direction: column;
`;

interface SubPageProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export default function SubPage(props: SubPageProps) {
  return (
    <PageContainer>
      <PageCard className={`${cardStyle} ${props.className}`}>
        <Typography variant="h1" sx={{ marginBottom: "24px" }}>
          {props.title}
        </Typography>
        {props.children}
      </PageCard>
    </PageContainer>
  );
}
