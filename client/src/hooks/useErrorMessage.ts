import { useEffect, useState } from "react";

export interface ErrorType {
  INITIAL: 0;
  NOT_FOUND: 404;
  INTERNAL_SERVER_ERROR:500;
}

export const useErrorMessage = <
  ErrorStatus extends ErrorType,
  ErrorObject extends string
>(
  errorMessageList: Record<keyof ErrorStatus, Record<ErrorObject, string>>
) => {
  const [errorState, setErrorState] = useState<keyof ErrorStatus>("INITIAL");
  const [errorText, setErrorText] = useState(errorMessageList.INITIAL);

  useEffect(() => {
    setErrorText(errorMessageList[errorState]);
  }, [errorState]);

  return {
    errorState,
    setErrorState,
    errorText,
  };
};