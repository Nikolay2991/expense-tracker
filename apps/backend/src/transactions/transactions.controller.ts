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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
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

/**
 * HTTP-контроллер транзакций (`/api/transactions`). Защищён {@link JwtAuthGuard};
 * текущий пользователь извлекается через `@CurrentUser()`. Логики не содержит —
 * только парсит вход и диспетчит команды/запросы через `CommandBus`/`QueryBus`.
 */
@ApiTags("transactions")
@ApiBearerAuth()
@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * `POST /api/transactions` — создаёт транзакцию для текущего пользователя.
   *
   * @param user - Текущий пользователь из JWT.
   * @param dto - Тело запроса с данными новой транзакции.
   * @returns Созданная транзакция в формате shared-DTO.
   * @throws {BadRequestException} Если категория не принадлежит пользователю или тело невалидно.
   */
  @ApiOperation({ summary: "Создать транзакцию" })
  @ApiResponse({ status: 201, description: "Транзакция успешно создана" })
  @ApiResponse({ status: 400, description: "Невалидные данные или категория не принадлежит пользователю" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateTransactionDto) {
    return this.commandBus.execute(new CreateTransactionCommand(user.id, dto));
  }

  /**
   * `GET /api/transactions` — возвращает страницу транзакций пользователя с итогами.
   *
   * @param user - Текущий пользователь из JWT.
   * @param query - Query-параметры фильтрации/пагинации (`month`, `year`, `page`, `limit`).
   * @returns Список транзакций, сводка сумм и метаданные пагинации.
   */
  @ApiOperation({ summary: "Получить список транзакций пользователя с пагинацией и сводкой сумм" })
  @ApiQuery({ name: "month", required: false, type: Number, description: "Месяц фильтра (1–12)" })
  @ApiQuery({ name: "year", required: false, type: Number, description: "Год фильтра" })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Номер страницы (по умолчанию 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Размер страницы (по умолчанию 10)" })
  @ApiResponse({ status: 200, description: "Список транзакций, сводка сумм и метаданные пагинации" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Query() query: QueryTransactionsDto,
  ) {
    return this.queryBus.execute(new GetTransactionsQuery(user.id, query));
  }

  /**
   * `GET /api/transactions/:id` — возвращает одну транзакцию пользователя.
   *
   * @param id - Идентификатор транзакции из URL (валидируется `ParseIntPipe`).
   * @param user - Текущий пользователь из JWT.
   * @returns Транзакция в формате shared-DTO.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   */
  @ApiOperation({ summary: "Получить транзакцию по идентификатору" })
  @ApiParam({ name: "id", type: Number, description: "Идентификатор транзакции" })
  @ApiResponse({ status: 200, description: "Транзакция найдена" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 404, description: "Транзакция не найдена" })
  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.queryBus.execute(new GetTransactionByIdQuery(id, user.id));
  }

  /**
   * `PATCH /api/transactions/:id` — частично обновляет транзакцию пользователя.
   *
   * @param id - Идентификатор транзакции из URL (валидируется `ParseIntPipe`).
   * @param user - Текущий пользователь из JWT.
   * @param dto - Тело запроса с изменяемыми полями.
   * @returns Обновлённая транзакция в формате shared-DTO.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   * @throws {BadRequestException} Если задан `categoryId`, не принадлежащий пользователю.
   */
  @ApiOperation({ summary: "Частично обновить транзакцию" })
  @ApiParam({ name: "id", type: Number, description: "Идентификатор транзакции" })
  @ApiResponse({ status: 200, description: "Транзакция обновлена" })
  @ApiResponse({ status: 400, description: "Невалидные данные или категория не принадлежит пользователю" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 404, description: "Транзакция не найдена" })
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

  /**
   * `DELETE /api/transactions/:id` — удаляет транзакцию пользователя. Возвращает 204.
   *
   * @param id - Идентификатор транзакции из URL (валидируется `ParseIntPipe`).
   * @param user - Текущий пользователь из JWT.
   * @returns Ничего (`void`); статус ответа — 204 No Content.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   */
  @ApiOperation({ summary: "Удалить транзакцию" })
  @ApiParam({ name: "id", type: Number, description: "Идентификатор транзакции" })
  @ApiResponse({ status: 204, description: "Транзакция удалена" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 404, description: "Транзакция не найдена" })
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: JwtUser) {
    return this.commandBus.execute(new DeleteTransactionCommand(id, user.id));
  }
}
