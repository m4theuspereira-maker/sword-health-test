export interface IRepository {
  create(input: any): Promise<any>;

  update(id: number, updatePayload: any): Promise<any>;

  findById(id: number, secondId?: number): Promise<any>;
}

export interface ICreateTaskDto {
  title: string;
  summary: string;
  userId: number;
  status?: string;
}

export interface ICreateUserDto {
  username: string;
  password: string;
  repeatPassword?: string;
  role: string;
}

export interface ITaskDto extends ICreateTaskDto {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
