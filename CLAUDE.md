# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Специфика пакетов вынесена во вложенные файлы, которые Claude Code подхватывает автоматически при работе с этими папками:

- `apps/backend/CLAUDE.md` — Nest.js, Prisma, backend-команды и окружение
- `apps/frontend/CLAUDE.md` — Next.js/FSD, shadcn/ui, frontend-команды и окружение

## Команды (из корня монорепо)

```bash
# Запуск всех приложений в watch-режиме
pnpm dev

# Сборка (сначала shared, потом apps)
pnpm build

# Линтер
pnpm lint
pnpm lint:fix

# Форматирование
pnpm format
pnpm format:check

# Проверка типов
pnpm typecheck
```

Команды отдельных пакетов — в их `CLAUDE.md`.

## Архитектура

pnpm workspaces монорепо без Turborepo. Три пакета:

- `apps/frontend` — Next.js 16, App Router, Feature-Sliced Design, Tailwind v4 + shadcn/ui, порт 3000
- `apps/backend` — Nest.js 11, REST API с префиксом `/api`, порт 3001
- `packages/shared` — общие TypeScript-интерфейсы для фронта и бэка

Shared-пакет подключается как `workspace:*` и резолвится напрямую из `src/` (поле `main` указывает на `./src/index.ts`), поэтому сборка shared не требуется в dev-режиме.

## Общие типы

- `packages/shared/src/types/category.ts` — `Category`, `CreateCategoryDto`, `UpdateCategoryDto`.
- `packages/shared/src/types/payment-method.ts` — `PaymentMethod`, `CreatePaymentMethodDto`, `UpdatePaymentMethodDto`.
- `packages/shared/src/types/transaction.ts` — `TransactionType`, `Transaction`, `CreateTransactionDto`, `UpdateTransactionDto`, `TransactionsSummary`, `TransactionsListResponse`.
- `packages/shared/src/types/auth.ts` — `UserPublic`, `AuthResponse`, `RegisterDto`, `LoginDto`.

Импортировать из `@expense-tracker/shared`, новые копии этих типов на фронте/бэке не заводить.

## Git

Соглашения по веткам, коммитам и Pull Request (GitHub Flow, Conventional Commits) вынесены в скилл `commit` (`.claude/skills/commit/SKILL.md`) — он подхватывается автоматически перед созданием ветки, коммита или PR.

## Окружение

- Корневой `.env.example` содержит только `DATABASE_URL` для справки.
- Пакетные `.env` описаны в `apps/backend/CLAUDE.md` и `apps/frontend/CLAUDE.md`.

## Документация
После изменения методов — обновляй JSDoc.
Для DTO и контроллеров — добавляй/обновляй Swagger декораторы.

При добавлении функционала проверяй .claude/docs/*.
Актуализируй файлы при изменении архитектуры или API.
