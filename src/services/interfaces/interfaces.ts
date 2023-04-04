export interface IUpdateTaskDto {
  taskId: number;
  userId: number;
  title?: string;
  sumary?: string;
  status?: string;
}
