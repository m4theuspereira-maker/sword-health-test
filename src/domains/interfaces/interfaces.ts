import { ICreateTaskDto } from "../../infra/repositories/interfaces/repository-interfaces";

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

export interface IUserValidated {
  isValid: boolean;
  user?: ICreateUserDto;
  error?: string;
}

export interface ITaskValidated {
  isValid: boolean;
  task?: ICreateTaskDto;
  error?: string;
}
