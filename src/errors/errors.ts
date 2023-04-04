export class InternalServerErrorExpection implements Error {
  name: string;
  message: string;

  constructor() {
    this.name = "InternalServerErrorExpection";
    this.message = INTERNAL_SERVER_ERROR_MESSAGE;
  }
}

export const INTERNAL_SERVER_ERROR_MESSAGE =
  "Internal Server Error, see the logs to get more informations";
export const DEPARTAMENT_NOT_FOUND_ERROR = "Departament not found";
export const PROCESS_NOT_FOUND_ERROR = "Process not found";
