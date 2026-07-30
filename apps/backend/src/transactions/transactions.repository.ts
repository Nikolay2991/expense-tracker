import { Injectable } from "@nestjs/common";
import { Prisma, Transaction, TransactionType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const transactionWithCategory = Prisma.validator<Prisma.TransactionDefaultArgs>()({
  include: { category: true },
});

export type TransactionWithCategory = Prisma.TransactionGetPayload<typeof transactionWithCategory>;

/**
 * Слой доступа к данным транзакций — единственное место, где выполняются
 * запросы к `PrismaService`. Возвращает «сырые» Prisma-типы без маппинга
 * в shared-DTO; фильтрация по владельцу (`userId`) закладывается в каждый метод.
 */
@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создаёт транзакцию из уже подготовленных данных (без проверок владения).
   *
   * @param data - Поля транзакции в формате Prisma, включая `userId`, `categoryId`
   *   и `amount` типа `Prisma.Decimal`.
   * @returns Созданная транзакция (без включённой категории).
   */
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  /**
   * Возвращает страницу транзакций пользователя, отсортированных по дате (убывание),
   * с включённой категорией.
   *
   * @param userId - Владелец, по которому фильтруется выборка.
   * @param options - Параметры выборки.
   * @param options.dateRange - Опциональный полуоткрытый интервал дат `[gte, lt)`.
   * @param options.skip - Сколько записей пропустить (смещение пагинации).
   * @param options.take - Максимальное количество записей на страницу.
   * @returns Массив транзакций вместе с их категориями.
   */
  findManyByUser(
    userId: number,
    options: {
      dateRange?: { gte: Date; lt: Date };
      skip?: number;
      take?: number;
    } = {},
  ): Promise<TransactionWithCategory[]> {
    const { dateRange, skip, take } = options;
    return this.prisma.transaction.findMany({
      where: { userId, ...(dateRange ? { date: dateRange } : {}) },
      orderBy: { date: "desc" },
      include: { category: true },
      skip,
      take,
    });
  }

  /**
   * Считает количество транзакций пользователя (для пагинации).
   *
   * @param userId - Владелец, по которому фильтруется подсчёт.
   * @param dateRange - Опциональный полуоткрытый интервал дат `[gte, lt)`.
   * @returns Число подходящих транзакций.
   */
  countByUser(userId: number, dateRange?: { gte: Date; lt: Date }): Promise<number> {
    return this.prisma.transaction.count({
      where: { userId, ...(dateRange ? { date: dateRange } : {}) },
    });
  }

  /**
   * Суммирует поле `amount` по транзакциям пользователя заданного типа —
   * используется для расчёта итогов дохода/расхода.
   *
   * @param userId - Владелец, по которому фильтруется агрегат.
   * @param type - Тип транзакций (`income` или `expense`).
   * @param dateRange - Опциональный полуоткрытый интервал дат `[gte, lt)`.
   * @returns Сумма как `Prisma.Decimal` либо `null`, если подходящих транзакций нет.
   */
  sumByType(
    userId: number,
    type: TransactionType,
    dateRange?: { gte: Date; lt: Date },
  ): Promise<Prisma.Decimal | null> {
    return this.prisma.transaction
      .aggregate({
        where: { userId, type, ...(dateRange ? { date: dateRange } : {}) },
        _sum: { amount: true },
      })
      .then((result) => result._sum.amount);
  }

  /**
   * Находит транзакцию по идентификатору только если она принадлежит пользователю
   * (проверка владения на уровне запроса).
   *
   * @param id - Идентификатор транзакции.
   * @param userId - Предполагаемый владелец.
   * @returns Транзакция либо `null`, если её нет или она принадлежит другому пользователю.
   */
  findByIdAndUser(id: number, userId: number): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({ where: { id, userId } });
  }

  /**
   * Проверяет, существует ли категория с данным id у пользователя — для валидации
   * `categoryId` перед созданием/обновлением транзакции.
   *
   * @param categoryId - Идентификатор категории.
   * @param userId - Предполагаемый владелец категории.
   * @returns `true`, если категория принадлежит пользователю, иначе `false`.
   */
  categoryExistsForUser(categoryId: number, userId: number): Promise<boolean> {
    return this.prisma.category
      .findFirst({ where: { id: categoryId, userId }, select: { id: true } })
      .then((category) => category !== null);
  }

  /**
   * Обновляет транзакцию по идентификатору уже подготовленными данными
   * (без проверки владения — она выполняется в сервисе).
   *
   * @param id - Идентификатор обновляемой транзакции.
   * @param data - Частичный набор полей в формате Prisma.
   * @returns Обновлённая транзакция.
   * @throws {Prisma.PrismaClientKnownRequestError} Если транзакции с таким id не существует.
   */
  update(id: number, data: Prisma.TransactionUncheckedUpdateInput): Promise<Transaction> {
    return this.prisma.transaction.update({ where: { id }, data });
  }

  /**
   * Удаляет транзакцию по идентификатору (без проверки владения — она в сервисе).
   *
   * @param id - Идентификатор удаляемой транзакции.
   * @returns Удалённая транзакция.
   * @throws {Prisma.PrismaClientKnownRequestError} Если транзакции с таким id не существует.
   */
  delete(id: number): Promise<Transaction> {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
