import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Category } from "@prisma/client";
import { CategoriesService } from "../../categories.service";
import { UpdateCategoryCommand } from "../update-category.command";

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(private readonly categoriesService: CategoriesService) {}

  execute(command: UpdateCategoryCommand): Promise<Category> {
    return this.categoriesService.update(
      command.id,
      command.userId,
      command.dto,
    );
  }
}
