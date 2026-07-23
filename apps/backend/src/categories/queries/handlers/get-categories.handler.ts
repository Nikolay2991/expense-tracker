import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Category } from "@prisma/client";
import { CategoriesService } from "../../categories.service";
import { GetCategoriesQuery } from "../get-categories.query";

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler
  implements IQueryHandler<GetCategoriesQuery>
{
  constructor(private readonly categoriesService: CategoriesService) {}

  execute(query: GetCategoriesQuery): Promise<Category[]> {
    return this.categoriesService.findAll(query.userId);
  }
}
