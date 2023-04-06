import { IDomainError } from "../interfaces/interfaces";

export const INVALID_ROLE = "INVALID_ROLE";
export const TOO_MANY_CHARACTERS_IN_summary = "TOO_MANY_CHARACTERS_IN_summary";
export const PASSWORD_DIFFERENT_OF_REPEAT_PASSWORD =
  "PASSWORD_DIFFERENT_OF_REPEAT_PASSWORD";
export const TOO_LOWER_CHARACTERS = "TOO_LOWER_CHARACTERS";
export const summary_EMPTY_ERROR = "summary_EMPTY";
export const EMPTY_TITLE_ERROR = "EMPTY_TITLE";
export const USER_ALREADY_FOUND_ERROR = "USER_ALREADY_FOUND";
export const USER_OR_TASK_NOT_FOUND = "USER_OR_TASK_NOT_FOUND";
export const INVALID_STATUS_ERROR = "INVALID_STATUS";
export const TASK_NOT_FOUND_ERROR = "TASK_NOT_FOUND";

export const invalidRoleError = (): IDomainError => {
  return { isValid: false, error: INVALID_ROLE };
};

export const tooManyCharactersError = (): IDomainError => {
  return { isValid: false, error: TOO_MANY_CHARACTERS_IN_summary };
};

export const passwordDifferentOfRepeatPasswordError = (): IDomainError => {
  return { isValid: false, error: PASSWORD_DIFFERENT_OF_REPEAT_PASSWORD };
};

export const tooLowerCharactersError = () => {
  return { isValid: false, error: TOO_LOWER_CHARACTERS };
};

export const summaryEmptyError = () => {
  return { isValid: false, error: summary_EMPTY_ERROR };
};

export const titleEmptyError = () => {
  return { isValid: false, error: EMPTY_TITLE_ERROR };
};

export const userAlreadyFoundError = (): IDomainError => {
  return { isValid: false, error: USER_ALREADY_FOUND_ERROR };
};

export const userNotFoundError = (): IDomainError => {
  return { isValid: false, error: USER_OR_TASK_NOT_FOUND };
};

export const taskNotFoundError = (): IDomainError => {
  return { isValid: false, error: TASK_NOT_FOUND_ERROR };
};

export const invalidStatusError = (): IDomainError => {
  return { isValid: false, error: INVALID_STATUS_ERROR };
};
