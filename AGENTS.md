<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Support Tickets — agent instructions

This is a local training app. Follow the layers already in the repo.

## Architecture

- UI calls route handlers. It does not import Prisma.
- Route handlers in `src/app/api` authenticate, read input, and return the JSON contract.
- Ticket rules live in `src/server/tickets/ticket.service.ts`.
- Prisma queries live in `src/server/tickets/ticket.repository.ts`.
- Map records to JSON in `src/server/tickets/ticket.mapper.ts`. List every response field there.
- Validate create input in `src/server/tickets/ticket.validation.ts`.
- Reuse these modules. Do not bypass them from a component or a route.

## Scope

- Keep the change bounded to the requested behaviour.
- Do not refactor unrelated code.
- Do not add a dependency unless a human approves it.
- Do not change the architecture unless a human approves it.

## Database safety

- Use only the local SQLite file from `DATABASE_URL` (`prisma/dev.db` in development).
- Tests use `prisma/test.db`. Do not point tests at `prisma/dev.db`.
- Migrations must preserve existing rows, ids, titles, statuses, and other stored values.
- Do not delete, reset, or recreate the database to make a check pass.
- `npm run db:reset` is destructive. Run it only after a human explicitly approves that reset.

## Validation

- Invalid input returns HTTP 400 with exactly these properties:

```json
{ "error": "VALIDATION_ERROR", "message": "..." }
```

- Keep the property names `error` and `message`.
- Add or update tests for behaviour you change.

## Verification

Before finishing, run the checks that apply and report their results:

- Relevant automated tests.
- Database evidence when a change persists data. `npm run db:inspect` prints id, status, creator, and title.
- API responses for the routes you changed.
- The flow in a browser: sign in, create, list, resolve, delete, refresh.
- Existing create, resolve, and delete behaviour still works.

## Reporting

Report:

- files changed
- migration created, or say that no migration was created
- commands executed
- actual results
- checks not run
- blockers
- any destructive action you want a human to approve (do not run it yourself)
