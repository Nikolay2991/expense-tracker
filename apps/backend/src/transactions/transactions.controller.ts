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
  Query,
  UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  CurrentUser,
  JwtUser,
} from "../auth/decorators/current-user.decorator";
import { CreateTransactionCommand } from "./commands/create-transaction.command";
import { DeleteTransactionCommand } from "./commands/delete-transaction.command";
import { UpdateTransactionCommand } from "./commands/update-transaction.command";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { GetTransactionByIdQuery } from "./queries/get-transaction-by-id.query";
import { GetTransactionsQuery } from "./queries/get-transactions.query";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateTransactionDto) {
    return this.commandBus.execute(new CreateTransactionCommand(user.id, dto));
  }

  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Query() query: QueryTransactionsDto,
  ) {
    return this.queryBus.execute(new GetTransactionsQuery(user.id, query));
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.queryBus.execute(new GetTransactionByIdQuery(id, user.id));
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.commandBus.execute(
      new UpdateTransactionCommand(id, user.id, dto),
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: JwtUser) {
    return this.commandBus.execute(new DeleteTransactionCommand(id, user.id));
  }
}
