# Backend (Nest.js)

Nest.js 10, REST API с префиксом `/api`, порт 3001. Часть монорепо — общие правила см. в корневом `CLAUDE.md`.

## Команды

```bash
# Prisma-миграции и studio
pnpm --filter backend prisma migrate dev --name <name>
pnpm --filter backend prisma:studio

# База данных (Docker), запускается из корня репозитория
docker compose up -d
docker compose down
```

## Добавление сущности

`PrismaModule` объявлен `@Global()` — `PrismaService` доступен во всех модулях без повторного импорта. При добавлении новой сущности:

1. Добавить модель в `prisma/schema.prisma`
2. Запустить `pnpm --filter backend prisma migrate dev --name <name>`
3. Создать модуль в `src/<feature>/` со структурой: `feature.module.ts`, `feature.controller.ts`, `feature.service.ts`
4. Подключить модуль в `AppModule`

Существующие модели: `Expense` (amount Decimal 12,2, date, description?, categoryId) и `Category` (name unique, color?).

## Окружение

- `.env` — шаблон `.env.example`.

## Общие типы

Импортировать из `@expense-tracker/shared` (`packages/shared/src/types/`), новые копии этих типов на бэке не заводить.
