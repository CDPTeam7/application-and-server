import { css } from "@linaria/core";
import { ThemeSheet } from "../../theme/ThemeSheet";

export type TextState = "" | "error" | "correct";

const titleStyle = css`
  font-size: ${ThemeSheet.Size.Article};
  color: ${ThemeSheet.Gray[700]};
`;

const subTitleStyle = css`
  font-size: 0.8rem;
  color: ${ThemeSheet.Gray[400]};
`

const inputStyle = css`
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: ${ThemeSheet.Size.Article};
  width: -webkit-fill-available;
  position: relative;
  border: none;
  background: ${ThemeSheet.Gray[100]};
  border-radius:1rem;
  transition: ease-in border-bottom 1ms;
  &:focus-visible {
    outline: 1px solid ${ThemeSheet.Branded[400]};
  }

  &.correct, &.correct:focus-visible {
    outline: 1px solid ${ThemeSheet.Blue[400]};
  }

  &.error, &.error:focus-visible {
    outline: 1px solid ${ThemeSheet.Red[400]};
  }
`;

export interface TextInputProps {
  title: string;
  subTitle?: string;
  state?:"" | "error" | "correct";
  name: string;
  id: string;
  type?:"password";
  value?: string;
  onChange?:React.ChangeEventHandler<HTMLInputElement>
}

export default function TextInput(props: TextInputProps) {
  return (
    <div>
      <div className={titleStyle}>{props.title}</div>
      {props.subTitle ? <div className={subTitleStyle}>{props.subTitle}</div> : ""}
      <input
        type={!props.type ? "text" : "password"}
        name={props.name}
        value={props.value}
        id={props.id}
        className={`${inputStyle} ${props.state ?? ""}`}
        onChange={props.onChange}
      />
    </div>
  );
}
