# Frontend (Next.js)

Next.js 16, App Router, Feature-Sliced Design, Tailwind v4 + shadcn/ui, порт 3000. Часть монорепо — общие правила см. в корневом `CLAUDE.md`.

## Команды

```bash
# Добавление shadcn/ui-компонента (из apps/frontend, ляжет в src/shared/ui/)
pnpm dlx shadcn@latest add <component>
```

## App Router

Все роуты в `src/app/` — этот слой остаётся тонким (страницы + layout + провайдеры), вся логика и UI живут в FSD-слоях рядом. Старые страницы могут использовать CSS Modules (`*.module.css` рядом с компонентом); новый UI собирается на Tailwind v4 + shadcn/ui. Глобальные стили и Tailwind-тема — `src/app/globals.css`. `transpilePackages: ["@expense-tracker/shared"]` прописан в `next.config.mjs`.

## Feature-Sliced Design

Слои (сверху вниз, зависимости — только вниз, через `index.ts` слоя):

```
src/
  app/        # роутинг Next.js: page.tsx, layout.tsx, providers.tsx — без бизнес-логики
  widgets/    # композиции из нескольких features/entities (пока не используется)
  features/   # пользовательские сценарии: features/auth (api/model/ui)
  entities/   # бизнес-сущности: entities/user (типы, без логики)
  shared/     # переиспользуемое без привязки к домену
    ui/       # компоненты shadcn/ui (алиас @/shared/ui, кладутся сюда через components.json)
    lib/      # утилиты, включая cn() в lib/utils.ts
    api/      # apiFetch(), хранение access-токена (shared/api/client.ts)
    config/   # env.ts и т.п.
```

Внутри слоя — папки `api/` (запросы), `model/` (состояние, схемы валидации, типы), `ui/` (компоненты). Наружу слой экспортирует только то, что нужно, через корневой `index.ts` (public API) — импортировать из `features/auth/ui/LoginForm` напрямую, минуя `features/auth`, не следует.

Добавление shadcn-компонентов: `pnpm dlx shadcn@latest add <component>` из `apps/frontend` — благодаря `components.json` компонент ляжет в `src/shared/ui/`.

## Окружение

- `.env` — `NEXT_PUBLIC_API_URL` (адрес backend API, по умолчанию `http://localhost:3001/api` захардкожен в `shared/config/env.ts`, если переменная не задана). Шаблон — `.env.example`.

## Общие типы

Импортировать из `@expense-tracker/shared` (`packages/shared/src/types/`), новые копии этих типов на фронте не заводить.
