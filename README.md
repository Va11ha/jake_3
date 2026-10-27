# SaveVault Education — система управления учебными материалами

Учебный проект каталога лекций, практических заданий и методических материалов. Для лабораторной работы №3 backend реализован на **Node.js + NestJS + TypeScript**; клиент — **React + TypeScript + Vite**.

## Требования
- Node.js 20 или новее
- npm

PostgreSQL в лабораторной №3 не используется: данные хранятся в оперативной памяти и сбрасываются при перезапуске сервера. Это соответствует методическим указаниям.

## Запуск
Из корня проекта:

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend health: http://localhost:3000/health  
Swagger: http://localhost:3000/api/docs

Для production-сборки: `npm run build`, затем `npm start`.

## Основные маршруты
| Метод | Маршрут | Назначение |
|---|---|---|
| GET | `/materials` | Список, поиск, фильтрация и сортировка материалов |
| GET | `/materials/:id` | Получение одного материала |
| POST | `/materials` | Создание материала (роль teacher/admin; multipart/form-data) |
| PATCH | `/materials/:id` | Изменение материала |
| PUT | `/materials/:id` | Полное/частичное изменение материала |
| DELETE | `/materials/:id` | Удаление материала, ответ 204 |
| GET | `/courses` | Список курсов |
| GET | `/courses/:id` | Один курс |
| POST | `/courses` | Создание курса (admin) |
| GET | `/categories` | Список категорий |
| GET | `/categories/:id` | Одна категория |
| POST | `/categories` | Создание категории (admin) |
| POST | `/auth/register` | Регистрация |
| POST | `/auth/login` | Вход и получение JWT |
| GET | `/auth/me` | Текущий пользователь |
| GET | `/api/docs` | Документация Swagger UI |

## Архитектура backend
- `src/main.ts` — запуск NestJS, CORS, глобальная валидация и Swagger.
- `src/app.module.ts` — корневой модуль приложения.
- `src/core/core.module.ts` — общий сервис и JWT-подпись.
- `src/materials/materials.module.ts`, `src/courses/courses.module.ts`, `src/categories/categories.module.ts`, `src/auth/auth.module.ts`, `src/admin/admin.module.ts`, `src/activity/activity.module.ts` — отдельные функциональные NestJS-модули.
- `src/app.service.ts` — учебное хранилище в памяти и бизнес-логика.
- `src/materials/` — маршруты материалов и DTO `CreateMaterialDto` / `UpdateMaterialDto`.
- `src/auth/` — регистрация, вход и текущая сессия.
- `src/categories/`, `src/courses/` — связанные справочные сущности.
- `src/admin/` — администрирование пользователей, ролей, курсов и категорий.
- `src/activity/` — история активности пользователя.

## Важные замечания
- При первом запуске первая зарегистрированная учётная запись получает роль `admin` для удобства учебной проверки; последующие аккаунты получают `student`. Не использовать это упрощение в публичном production-приложении.
- Данные пользователей и материалы живут только в памяти процесса. Пароли хешируются bcryptjs, токены подписываются JWT. Для реального развёртывания нужны постоянная БД, секрет JWT из окружения, усиленная авторизация и тесты.
- Файлы до 20 МБ сохраняются в `backend/uploads`.
- Для frontend можно переопределить API-адрес переменной `VITE_API_URL`; по умолчанию используется `http://localhost:3000`.
