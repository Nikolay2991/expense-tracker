import { PartialType } from "@nestjs/swagger";
import { CreateTransactionDto } from "./create-transaction.dto";

/**
 * Тело запроса на частичное обновление транзакции. Наследует все поля
 * {@link CreateTransactionDto} через `PartialType`, делая их необязательными:
 * переданные поля обновляются, отсутствующие остаются без изменений.
 */
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
