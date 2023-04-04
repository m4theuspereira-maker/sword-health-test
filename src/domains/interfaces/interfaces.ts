export interface ICreateUserDto {
  username: string;
  password: string;
  repeatPassword?: string;
  role: string;
}

export interface IDomainError {
  isValid: boolean;
  error: string;
}
