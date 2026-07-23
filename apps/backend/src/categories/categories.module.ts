import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CategoriesController } from "./categories.controller";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";
import { CategoryCommandHandlers, CategoryQueryHandlers } from "./handlers";

@Module({
  imports: [CqrsModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
    ...CategoryCommandHandlers,
    ...CategoryQueryHandlers,
  ],
})
export class CategoriesModule {}
