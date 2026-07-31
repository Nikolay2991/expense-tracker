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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser, JwtUser } from "../auth/decorators/current-user.decorator";
import { CreatePaymentMethodCommand } from "./commands/create-payment-method.command";
import { DeletePaymentMethodCommand } from "./commands/delete-payment-method.command";
import { UpdatePaymentMethodCommand } from "./commands/update-payment-method.command";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { PaymentMethodResponseDto } from "./dto/payment-method-response.dto";
import { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";
import { GetPaymentMethodsQuery } from "./queries/get-payment-methods.query";

/**
 * HTTP-контроллер способов оплаты (`/api/payment-methods`). Защищён {@link JwtAuthGuard};
 * текущий пользователь извлекается через `@CurrentUser()`. Логики не содержит —
 * только парсит вход и диспетчит команды/запросы через `CommandBus`/`QueryBus`.
 */
@ApiTags("payment-methods")
@ApiBearerAuth()
@Controller("payment-methods")
@UseGuards(JwtAuthGuard)
export class PaymentMethodsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * `POST /api/payment-methods` — создаёт способ оплаты для текущего пользователя.
   *
   * @param user - Текущий пользователь из JWT.
   * @param dto - Тело запроса с данными нового способа оплаты.
   * @returns Созданный способ оплаты.
   * @throws {ConflictException} Если способ оплаты с таким именем уже есть у пользователя.
   */
  @ApiOperation({ summary: "Создать способ оплаты" })
  @ApiResponse({ status: 201, description: "Способ оплаты создан", type: PaymentMethodResponseDto })
  @ApiResponse({ status: 400, description: "Невалидные данные" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 409, description: "Способ оплаты с таким именем уже существует" })
  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreatePaymentMethodDto) {
    return this.commandBus.execute(new CreatePaymentMethodCommand(user.id, dto));
  }

  /**
   * `GET /api/payment-methods` — возвращает все способы оплаты пользователя.
   *
   * @param user - Текущий пользователь из JWT.
   * @returns Список способов оплаты.
   */
  @ApiOperation({ summary: "Получить список способов оплаты пользователя" })
  @ApiResponse({ status: 200, description: "Список способов оплаты", type: [PaymentMethodResponseDto] })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.queryBus.execute(new GetPaymentMethodsQuery(user.id));
  }

  /**
   * `PATCH /api/payment-methods/:id` — частично обновляет способ оплаты пользователя.
   *
   * @param id - Идентификатор способа оплаты из URL (валидируется `ParseIntPipe`).
   * @param user - Текущий пользователь из JWT.
   * @param dto - Тело запроса с изменяемыми полями.
   * @returns Обновлённый способ оплаты.
   * @throws {NotFoundException} Если способ оплаты не найден или принадлежит другому пользователю.
   * @throws {ConflictException} Если способ оплаты с новым именем уже есть у пользователя.
   */
  @ApiOperation({ summary: "Частично обновить способ оплаты" })
  @ApiParam({ name: "id", type: Number, description: "Идентификатор способа оплаты" })
  @ApiResponse({ status: 200, description: "Способ оплаты обновлён", type: PaymentMethodResponseDto })
  @ApiResponse({ status: 400, description: "Невалидные данные" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 404, description: "Способ оплаты не найден" })
  @ApiResponse({ status: 409, description: "Способ оплаты с таким именем уже существует" })
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdatePaymentMethodDto,
  ) {
    return this.commandBus.execute(new UpdatePaymentMethodCommand(id, user.id, dto));
  }

  /**
   * `DELETE /api/payment-methods/:id` — удаляет способ оплаты пользователя. Возвращает 204.
   *
   * @param id - Идентификатор способа оплаты из URL (валидируется `ParseIntPipe`).
   * @param user - Текущий пользователь из JWT.
   * @returns Ничего (`void`); статус ответа — 204 No Content.
   * @throws {NotFoundException} Если способ оплаты не найден или принадлежит другому пользователю.
   */
  @ApiOperation({ summary: "Удалить способ оплаты" })
  @ApiParam({ name: "id", type: Number, description: "Идентификатор способа оплаты" })
  @ApiResponse({ status: 204, description: "Способ оплаты удалён" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 404, description: "Способ оплаты не найден" })
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: JwtUser) {
    return this.commandBus.execute(new DeletePaymentMethodCommand(id, user.id));
  }
}
