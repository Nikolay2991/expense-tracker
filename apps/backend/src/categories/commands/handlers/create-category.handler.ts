import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Category } from "@prisma/client";
import { CategoriesService } from "../../categories.service";
import { CreateCategoryCommand } from "../create-category.command";

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(private readonly categoriesService: CategoriesService) {}

  execute(command: CreateCategoryCommand): Promise<Category> {
    return this.categoriesService.create(command.userId, command.dto);
  }
}
