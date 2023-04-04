export interface IRepository {
  create(input: any): Promise<any>;

  update(id: number, updatePayload: any): Promise<any>;

  findById(id: number): Promise<any>;
}
