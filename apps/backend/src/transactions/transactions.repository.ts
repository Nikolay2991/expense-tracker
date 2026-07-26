import { Injectable } from "@nestjs/common";
import { Prisma, Transaction, TransactionType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const transactionWithCategory = Prisma.validator<Prisma.TransactionDefaultArgs>()({
  include: { category: true },
});

export type TransactionWithCategory = Prisma.TransactionGetPayload<typeof transactionWithCategory>;

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

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

  countByUser(userId: number, dateRange?: { gte: Date; lt: Date }): Promise<number> {
    return this.prisma.transaction.count({
      where: { userId, ...(dateRange ? { date: dateRange } : {}) },
    });
  }

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

  findByIdAndUser(id: number, userId: number): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({ where: { id, userId } });
  }

  categoryExistsForUser(categoryId: number, userId: number): Promise<boolean> {
    return this.prisma.category
      .findFirst({ where: { id: categoryId, userId }, select: { id: true } })
      .then((category) => category !== null);
  }

  update(id: number, data: Prisma.TransactionUncheckedUpdateInput): Promise<Transaction> {
    return this.prisma.transaction.update({ where: { id }, data });
  }

  delete(id: number): Promise<Transaction> {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
