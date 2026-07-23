import { Injectable } from "@nestjs/common";
import { Prisma, Transaction, TransactionType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  findManyByUser(
    userId: number,
    dateRange?: { gte: Date; lt: Date },
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId, ...(dateRange ? { date: dateRange } : {}) },
      orderBy: { date: "desc" },
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

  update(
    id: number,
    data: Prisma.TransactionUncheckedUpdateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({ where: { id }, data });
  }

  delete(id: number): Promise<Transaction> {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
