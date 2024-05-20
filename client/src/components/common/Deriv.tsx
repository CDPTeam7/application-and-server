import { styled } from "@linaria/react";

const Span = styled.span<{ deriv: number }>`
  color: ${(props) => (props.deriv === 0 ? "gray" : props.deriv > 0 ? "red" : "blue")};
`;

export default function Deriv(props: { deriv: number; className?: string }) {
  const { deriv } = props;
  const marker = deriv == 0 ? "-" : deriv > 0 ? "▲" : "▼";
  return (
    <Span className={`${props.className}`} deriv={deriv}>
      ({deriv == 0 ? undefined : Math.abs(deriv)}
      {marker})
    </Span>
  );
}
