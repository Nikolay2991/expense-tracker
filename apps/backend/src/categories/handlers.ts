import { CreateCategoryHandler } from "./commands/handlers/create-category.handler";
import { DeleteCategoryHandler } from "./commands/handlers/delete-category.handler";
import { UpdateCategoryHandler } from "./commands/handlers/update-category.handler";
import { GetCategoriesHandler } from "./queries/handlers/get-categories.handler";

export const CategoryCommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];

export const CategoryQueryHandlers = [GetCategoriesHandler];
