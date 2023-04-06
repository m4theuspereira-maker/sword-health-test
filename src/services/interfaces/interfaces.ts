export interface IUpdateTaskDto {
  taskId: number;
  userId: number;
  title?: string;
  summary?: string;
  status?: string;
}
