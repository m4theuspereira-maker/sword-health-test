export interface IRepository {
  create(input: any): Promise<any>;

  update(id: number, updatePayload: any): Promise<any>;

  findById(id: number): Promise<any>;
}

export interface ICreateTaskDto {
  sumary: string;
  userId: number;
}

export interface ICreateUserDto {
  username: string;
  password: string;
  repeatPassword?: string;
  role: string;
}
