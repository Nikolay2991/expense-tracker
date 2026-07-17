import { CreateUserHandler } from "./commands/handlers/create-user.handler";
import { GetUserByEmailHandler } from "./queries/handlers/get-user-by-email.handler";
import { GetUserByIdHandler } from "./queries/handlers/get-user-by-id.handler";

export const UserCommandHandlers = [CreateUserHandler];
export const UserQueryHandlers = [GetUserByEmailHandler, GetUserByIdHandler];
