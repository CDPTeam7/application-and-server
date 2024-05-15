import { useEffect, useState } from "react";

export interface ErrorType {
  INITIAL: "INITIAL";
  NOT_FOUND: "ERR_NOT_FOUND";
  INTERNAL_SERVER_ERROR: "ERR_SERVER";
}

export const useErrorMessage = <ErrorStatus extends ErrorType, ErrorObject extends string>(
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
