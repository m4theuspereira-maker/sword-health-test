export interface IRepository {
  create(input: any): Promise<any>;

  update(id: number, updatePayload: any): Promise<any>;

  findById(id: number): Promise<any>;
}

export interface ICreateTaskDto {
  title: string;
  sumary: string;
  userId: number;
  status?: string;
}

export interface ICreateUserDto {
  username: string;
  password: string;
  repeatPassword?: string;
  role: string;
}
