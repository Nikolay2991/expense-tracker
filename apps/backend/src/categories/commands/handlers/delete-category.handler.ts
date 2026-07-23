import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Category } from "@prisma/client";
import { CategoriesService } from "../../categories.service";
import { DeleteCategoryCommand } from "../delete-category.command";

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(private readonly categoriesService: CategoriesService) {}

  execute(command: DeleteCategoryCommand): Promise<Category> {
    return this.categoriesService.remove(command.id, command.userId);
  }
}
