import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PaymentMethodsRepository } from "./payment-methods.repository";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";

/**
 * Бизнес-логика способов оплаты: проверка владения ресурсами и преобразование
 * ошибки уникальности имени в понятное исключение. Работа с БД делегируется
 * в {@link PaymentMethodsRepository}.
 */
@Injectable()
export class PaymentMethodsService {
  constructor(private readonly repo: PaymentMethodsRepository) {}

  /**
   * Создаёт способ оплаты для пользователя.
   *
   * @param userId - Идентификатор владельца-создателя.
   * @param dto - Данные нового способа оплаты.
   * @returns Созданный способ оплаты.
   * @throws {ConflictException} Если у пользователя уже есть способ оплаты с таким `name`.
   */
  async create(userId: number, dto: CreatePaymentMethodDto) {
    try {
      return await this.repo.create(userId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException(`Способ оплаты с именем "${dto.name}" уже существует`);
      }
      throw err;
    }
  }

  /**
   * Возвращает все способы оплаты пользователя.
   *
   * @param userId - Идентификатор владельца.
   * @returns Массив способов оплаты.
   */
  findAll(userId: number) {
    return this.repo.findAllByUser(userId);
  }

  /**
   * Частично обновляет способ оплаты пользователя.
   *
   * @param id - Идентификатор обновляемого способа оплаты.
   * @param userId - Идентификатор владельца.
   * @param dto - Частичный набор полей для обновления.
   * @returns Обновлённый способ оплаты.
   * @throws {NotFoundException} Если способ оплаты не найден или принадлежит другому пользователю.
   * @throws {ConflictException} Если у пользователя уже есть способ оплаты с таким `name`.
   */
  async update(id: number, userId: number, dto: UpdatePaymentMethodDto) {
    const paymentMethod = await this.repo.findByIdAndUser(id, userId);
    if (!paymentMethod) {
      throw new NotFoundException(`Способ оплаты #${id} не найден`);
    }

    try {
      return await this.repo.update(id, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException(`Способ оплаты с именем "${dto.name}" уже существует`);
      }
      throw err;
    }
  }

  /**
   * Удаляет способ оплаты пользователя, предварительно проверив владение.
   *
   * @param id - Идентификатор удаляемого способа оплаты.
   * @param userId - Идентификатор владельца.
   * @returns Удалённый способ оплаты.
   * @throws {NotFoundException} Если способ оплаты не найден или принадлежит другому пользователю.
   */
  async remove(id: number, userId: number) {
    const paymentMethod = await this.repo.findByIdAndUser(id, userId);
    if (!paymentMethod) {
      throw new NotFoundException(`Способ оплаты #${id} не найден`);
    }

    return this.repo.delete(id);
  }
}
