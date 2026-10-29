# MY BAND — учебный проект на React + TypeScript

## Как запустить

1. Установи Node.js, если он ещё не установлен.
2. Распакуй архив.
3. Открой папку проекта в VS Code.
4. Открой терминал в папке, где лежит `package.json`.
5. Выполни:

```powershell
npm.cmd install
npm.cmd run dev
```

6. Открой адрес, который покажет Vite, обычно `http://localhost:5173`.

Если PowerShell пишет, что запуск `npm.ps1` запрещён, используй `npm.cmd`, как в командах выше.

## Что находится в проекте

- `src/App.tsx` — страницы и обработчики кнопок.
- `src/api.ts` — запросы к backend.
- `src/style.css` — простой дизайн сайта.
- `public/hero.jpg` — фоновая картинка на главной странице.
- `.github/workflows/deploy.yml` — публикация сайта через GitHub Pages.

## Важно про backend

В `src/api.ts` указаны примерные маршруты:
- `/auth/register`
- `/auth/login`
- `/auth/logout`
- `/profile`

Открой Swagger преподавателя: https://inai-col2.fishrungames.com/api/docs/
и сравни названия маршрутов, методы и поля запроса. Если они отличаются, измени их в `src/api.ts`. Без проверки Swagger нельзя гарантировать, что регистрация и вход заработают с первого запуска.

## Публикация на GitHub Pages

Загрузи проект в GitHub-репозиторий. Затем открой **Settings → Pages** и выбери **GitHub Actions**, если эта настройка доступна. После push в ветку `main` workflow соберёт сайт.
GitHub Pages публикует frontend, но сам backend должен быть доступен отдельно.
