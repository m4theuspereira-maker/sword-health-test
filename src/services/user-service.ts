import { UsersRepository } from "../infra/repositories/user-repository";

export class UserServices {
  constructor(private readonly userRepository: UsersRepository) {}



  async createUser(username: string, password: string, repeatPassword: string, role: string){
    
  }

}
