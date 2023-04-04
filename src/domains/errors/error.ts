import { IDomainError } from "../interfaces/interfaces";

export const INVALID_ROLE = "INVALID_ROLE";
export const TOO_MANY_CHARACTERS_IN_SUMARY = "TOO_MANY_CHARACTERS_IN_SUMARY";
export const PASSWORD_DIFFERENT_OF_REPEAT_PASSWORD =
  "PASSWORD_DIFFERENT_OF_REPEAT_PASSWORD";

export const invalidRoleError = (): IDomainError => {
  return { isValid: false, error: INVALID_ROLE };
};

export const tooManyCharactersError = (): IDomainError => {
  return { isValid: false, error: TOO_MANY_CHARACTERS_IN_SUMARY };
};

export const passwordDifferentOfRepeatPasswordError = (): IDomainError => {
  return { isValid: false, error: TOO_MANY_CHARACTERS_IN_SUMARY };
};

