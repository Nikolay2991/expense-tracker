import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  CurrentUser,
  JwtUser,
} from "../auth/decorators/current-user.decorator";
import { CreateCategoryCommand } from "./commands/create-category.command";
import { DeleteCategoryCommand } from "./commands/delete-category.command";
import { UpdateCategoryCommand } from "./commands/update-category.command";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { GetCategoriesQuery } from "./queries/get-categories.query";

@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateCategoryDto) {
    return this.commandBus.execute(new CreateCategoryCommand(user.id, dto));
  }

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.queryBus.execute(new GetCategoriesQuery(user.id));
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.commandBus.execute(
      new UpdateCategoryCommand(id, user.id, dto),
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: JwtUser) {
    return this.commandBus.execute(new DeleteCategoryCommand(id, user.id));
  }
}
