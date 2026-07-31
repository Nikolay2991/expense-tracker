import { Injectable } from "@nestjs/common";
import { PaymentMethod } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";

/**
 * Слой доступа к данным способов оплаты — единственное место, где выполняются
 * запросы к `PrismaService`. Возвращает «сырые» Prisma-типы без маппинга в shared-DTO.
 */
@Injectable()
export class PaymentMethodsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создаёт способ оплаты для пользователя.
   *
   * @param userId - Идентификатор владельца.
   * @param dto - Данные нового способа оплаты.
   * @returns Созданный способ оплаты.
   * @throws {Prisma.PrismaClientKnownRequestError} При нарушении `@@unique([userId, name])` (код `P2002`).
   */
  create(userId: number, dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    return this.prisma.paymentMethod.create({ data: { ...dto, userId } });
  }

  /**
   * Возвращает все способы оплаты пользователя.
   *
   * @param userId - Владелец, по которому фильтруется выборка.
   * @returns Массив способов оплаты.
   */
  findAllByUser(userId: number): Promise<PaymentMethod[]> {
    return this.prisma.paymentMethod.findMany({ where: { userId } });
  }

  /**
   * Находит способ оплаты по идентификатору только если он принадлежит пользователю.
   *
   * @param id - Идентификатор способа оплаты.
   * @param userId - Предполагаемый владелец.
   * @returns Способ оплаты либо `null`, если его нет или он принадлежит другому пользователю.
   */
  findByIdAndUser(id: number, userId: number): Promise<PaymentMethod | null> {
    return this.prisma.paymentMethod.findFirst({ where: { id, userId } });
  }

  /**
   * Проверяет, существует ли способ оплаты с данным id у пользователя — для валидации
   * `paymentMethodId` перед созданием/обновлением транзакции.
   *
   * @param id - Идентификатор способа оплаты.
   * @param userId - Предполагаемый владелец.
   * @returns `true`, если способ оплаты принадлежит пользователю, иначе `false`.
   */
  existsForUser(id: number, userId: number): Promise<boolean> {
    return this.prisma.paymentMethod
      .findFirst({ where: { id, userId }, select: { id: true } })
      .then((paymentMethod) => paymentMethod !== null);
  }

  /**
   * Обновляет способ оплаты по идентификатору уже подготовленными данными
   * (без проверки владения — она выполняется в сервисе).
   *
   * @param id - Идентификатор обновляемого способа оплаты.
   * @param dto - Частичный набор изменяемых полей.
   * @returns Обновлённый способ оплаты.
   * @throws {Prisma.PrismaClientKnownRequestError} При нарушении `@@unique([userId, name])` (код `P2002`).
   */
  update(id: number, dto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    return this.prisma.paymentMethod.update({ where: { id }, data: dto });
  }

  /**
   * Удаляет способ оплаты по идентификатору (без проверки владения — она в сервисе).
   *
   * @param id - Идентификатор удаляемого способа оплаты.
   * @returns Удалённый способ оплаты.
   */
  delete(id: number): Promise<PaymentMethod> {
    return this.prisma.paymentMethod.delete({ where: { id } });
  }
}
