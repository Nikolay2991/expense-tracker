import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

/**
 * Общий 401-ответ для всех эндпоинтов `TransactionsController` —
 * контроллер целиком защищён `JwtAuthGuard`, поэтому статус один и тот же везде.
 */
export function ApiTransactionUnauthorizedResponse() {
  return applyDecorators(
    ApiResponse({ status: 401, description: "Не авторизован" }),
  );
}

/**
 * Общий 404-ответ для операций над транзакцией по идентификатору
 * (найдено только когда транзакция существует и принадлежит текущему пользователю).
 */
export function ApiTransactionNotFoundResponse() {
  return applyDecorators(
    ApiResponse({ status: 404, description: "Транзакция не найдена" }),
  );
}
