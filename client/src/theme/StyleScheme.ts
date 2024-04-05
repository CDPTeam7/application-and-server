export type ColorCode = string;
export type FontSize = string; // rem 단위

export interface StyleSheet {
  White:ColorCode,
  Black:ColorCode,
  Gray:{
    100:ColorCode,
    200:ColorCode,
    300:ColorCode,
    400:ColorCode,
    500:ColorCode,
    600:ColorCode,
    700:ColorCode,
    800:ColorCode,
    900:ColorCode
  },

  Branded: {
    100:ColorCode,
    200:ColorCode,
    300:ColorCode,
    400:ColorCode,
    500:ColorCode,
    600:ColorCode,
    700:ColorCode,
    800:ColorCode,
    900:ColorCode
  },

  Blue: {
    100:ColorCode,
    200:ColorCode,
    300:ColorCode,
    400:ColorCode,
    500:ColorCode,
    600:ColorCode,
    700:ColorCode,
    800:ColorCode,
    900:ColorCode
  },

  Red: {
    100:ColorCode,
    200:ColorCode,
    300:ColorCode,
    400:ColorCode,
    500:ColorCode,
    600:ColorCode,
    700:ColorCode,
    800:ColorCode,
    900:ColorCode
  },
  Size: {
    Title:FontSize,
    Desc:FontSize,
    Article:FontSize,
  },
  Animation:{
    Transition:string,
  }
}