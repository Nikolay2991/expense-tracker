import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  Category as CategoryModel,
  PaymentMethod as PaymentMethodModel,
  Prisma,
  Transaction,
  TransactionType,
} from "@prisma/client";
import type {
  Transaction as TransactionDto,
  TransactionsListResponse,
  TransactionsSummary,
} from "@expense-tracker/shared";
import { TransactionsRepository } from "./transactions.repository";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { QueryTransactionsDto } from "./dto/query-transactions.dto";

/**
 * Бизнес-логика транзакций: проверка владения ресурсами, правила заполнения,
 * расчёт итогов и маппинг Prisma-моделей в shared-DTO (в т.ч. `Decimal → number`).
 * Работа с БД делегируется в {@link TransactionsRepository}.
 */
@Injectable()
export class TransactionsService {
  constructor(private readonly repo: TransactionsRepository) {}

  /**
   * Создаёт транзакцию для пользователя, предварительно проверив, что указанная
   * категория принадлежит ему.
   *
   * @param userId - Идентификатор владельца-создателя.
   * @param dto - Данные новой транзакции (`amount`, `type`, `categoryId`, и т.д.).
   * @returns Созданная транзакция в формате shared-DTO.
   * @throws {BadRequestException} Если категория `dto.categoryId` не принадлежит пользователю,
   *   либо задан `dto.paymentMethodId`, не принадлежащий пользователю.
   */
  async create(userId: number, dto: CreateTransactionDto): Promise<TransactionDto> {
    await this.assertCategoryOwned(dto.categoryId, userId);
    if (dto.paymentMethodId !== undefined) {
      await this.assertPaymentMethodOwned(dto.paymentMethodId, userId);
    }

    const transaction = await this.repo.create({
      userId,
      amount: new Prisma.Decimal(dto.amount),
      type: dto.type,
      description: dto.description,
      date: dto.date,
      categoryId: dto.categoryId,
      paymentMethodId: dto.paymentMethodId,
    });

    return this.toDto(transaction);
  }

  /**
   * Возвращает страницу транзакций пользователя вместе с итогами (доход, расход,
   * баланс) и метаданными пагинации. Список, счётчик и агрегаты сумм считаются
   * параллельно.
   *
   * @param userId - Идентификатор владельца.
   * @param query - Фильтры и пагинация: `month`/`year` (интервал дат), `page`, `limit`.
   *   При отсутствии `page`/`limit` берутся значения по умолчанию (1 и 10).
   * @returns Объект с массивом транзакций, сводкой сумм и полями `total`/`page`/`limit`.
   */
  async findAll(userId: number, query: QueryTransactionsDto): Promise<TransactionsListResponse> {
    const dateRange = this.buildDateRange(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [transactions, total, incomeSum, expenseSum] = await Promise.all([
      this.repo.findManyByUser(userId, { dateRange, skip, take: limit }),
      this.repo.countByUser(userId, dateRange),
      this.repo.sumByType(userId, TransactionType.income, dateRange),
      this.repo.sumByType(userId, TransactionType.expense, dateRange),
    ]);

    const income = incomeSum?.toNumber() ?? 0;
    const expense = expenseSum?.toNumber() ?? 0;
    const summary: TransactionsSummary = {
      income,
      expense,
      balance: income - expense,
    };

    return {
      transactions: transactions.map((t) => this.toDto(t)),
      summary,
      total,
      page,
      limit,
    };
  }

  /**
   * Возвращает одну транзакцию пользователя по идентификатору.
   *
   * @param id - Идентификатор транзакции.
   * @param userId - Идентификатор владельца.
   * @returns Транзакция в формате shared-DTO.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   */
  async findOne(id: number, userId: number): Promise<TransactionDto> {
    const transaction = await this.getOwned(id, userId);
    return this.toDto(transaction);
  }

  /**
   * Частично обновляет транзакцию пользователя: переданные поля перезаписываются,
   * отсутствующие остаются без изменений. При смене категории проверяется её владение.
   *
   * @param id - Идентификатор обновляемой транзакции.
   * @param userId - Идентификатор владельца.
   * @param dto - Частичный набор полей для обновления.
   * @returns Обновлённая транзакция в формате shared-DTO.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   * @throws {BadRequestException} Если задан `dto.categoryId` или `dto.paymentMethodId`,
   *   не принадлежащий пользователю.
   */
  async update(id: number, userId: number, dto: UpdateTransactionDto): Promise<TransactionDto> {
    await this.getOwned(id, userId);

    if (dto.categoryId !== undefined) {
      await this.assertCategoryOwned(dto.categoryId, userId);
    }
    if (dto.paymentMethodId !== undefined) {
      await this.assertPaymentMethodOwned(dto.paymentMethodId, userId);
    }

    const transaction = await this.repo.update(id, {
      ...(dto.amount !== undefined ? { amount: new Prisma.Decimal(dto.amount) } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.date !== undefined ? { date: dto.date } : {}),
      ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
      ...(dto.paymentMethodId !== undefined ? { paymentMethodId: dto.paymentMethodId } : {}),
    });

    return this.toDto(transaction);
  }

  /**
   * Удаляет транзакцию пользователя, предварительно проверив владение.
   *
   * @param id - Идентификатор удаляемой транзакции.
   * @param userId - Идентификатор владельца.
   * @returns Ничего (`void`) при успешном удалении.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   */
  async remove(id: number, userId: number): Promise<void> {
    await this.getOwned(id, userId);
    await this.repo.delete(id);
  }

  /**
   * Загружает транзакцию, гарантируя её принадлежность пользователю.
   *
   * @param id - Идентификатор транзакции.
   * @param userId - Предполагаемый владелец.
   * @returns Prisma-модель транзакции.
   * @throws {NotFoundException} Если транзакция не найдена или принадлежит другому пользователю.
   */
  private async getOwned(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.repo.findByIdAndUser(id, userId);
    if (!transaction) {
      throw new NotFoundException(`Транзакция #${id} не найдена`);
    }
    return transaction;
  }

  /**
   * Проверяет, что категория принадлежит пользователю, иначе прерывает операцию.
   *
   * @param categoryId - Идентификатор категории.
   * @param userId - Предполагаемый владелец категории.
   * @returns Ничего (`void`), если проверка пройдена.
   * @throws {BadRequestException} Если категория не найдена или принадлежит другому пользователю.
   */
  private async assertCategoryOwned(categoryId: number, userId: number): Promise<void> {
    const exists = await this.repo.categoryExistsForUser(categoryId, userId);
    if (!exists) {
      throw new BadRequestException(`Категория #${categoryId} не найдена`);
    }
  }

  /**
   * Проверяет, что способ оплаты принадлежит пользователю, иначе прерывает операцию.
   *
   * @param paymentMethodId - Идентификатор способа оплаты.
   * @param userId - Предполагаемый владелец способа оплаты.
   * @returns Ничего (`void`), если проверка пройдена.
   * @throws {BadRequestException} Если способ оплаты не найден или принадлежит другому пользователю.
   */
  private async assertPaymentMethodOwned(paymentMethodId: number, userId: number): Promise<void> {
    const exists = await this.repo.paymentMethodExistsForUser(paymentMethodId, userId);
    if (!exists) {
      throw new BadRequestException(`Способ оплаты #${paymentMethodId} не найден`);
    }
  }

  /**
   * Строит полуоткрытый интервал дат `[gte, lt)` в UTC по фильтрам месяца/года.
   * Если задан только год — интервал охватывает весь год; если задан месяц —
   * конкретный месяц (при отсутствии года берётся текущий UTC-год).
   *
   * @param query - Фильтр с опциональными `month` (1–12) и `year`.
   * @returns Интервал дат либо `undefined`, если ни `month`, ни `year` не заданы
   *   (тогда выборка не ограничивается по дате).
   */
  private buildDateRange(query: QueryTransactionsDto): { gte: Date; lt: Date } | undefined {
    const { month, year } = query;
    if (year === undefined && month === undefined) return undefined;

    const now = new Date();
    const targetYear = year ?? now.getUTCFullYear();

    if (month === undefined) {
      return {
        gte: new Date(Date.UTC(targetYear, 0, 1)),
        lt: new Date(Date.UTC(targetYear + 1, 0, 1)),
      };
    }

    return {
      gte: new Date(Date.UTC(targetYear, month - 1, 1)),
      lt: new Date(Date.UTC(targetYear, month, 1)),
    };
  }

  /**
   * Преобразует Prisma-модель транзакции в shared-DTO: конвертирует денежное поле
   * `amount` из `Prisma.Decimal` в `number` и включает категорию/способ оплаты, если они загружены.
   *
   * @param transaction - Prisma-модель транзакции, опционально с включёнными категорией и способом оплаты.
   * @returns Транзакция в формате shared-DTO, безопасном для отдачи наружу.
   */
  private toDto(
    transaction: Transaction & {
      category?: CategoryModel | null;
      paymentMethod?: PaymentMethodModel | null;
    },
  ): TransactionDto {
    const { category, paymentMethod, ...rest } = transaction;
    return {
      ...rest,
      amount: transaction.amount.toNumber(),
      ...(category ? { category } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
    };
  }
}
