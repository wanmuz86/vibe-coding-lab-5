# Architecture

```text
Browser
  ↓
Next.js UI
  ↓
Server/API Boundary
  ↓
Ticket Service
  ↓
Ticket Repository / Prisma
  ↓
SQLite
```

## UI

`src/app` and `src/components` render the login form, create form, ticket list, and ticket detail. Interactive screens call `/api/*` with `fetch`. They do not contain ticket rules or Prisma calls.

`src/proxy.ts` only checks that a session cookie is present and redirects page requests. It does not decide ticket permissions.

## API / server boundary

Route handlers live in `src/app/api`.

- `POST /api/auth/login` checks the account and sets an httpOnly `session` cookie.
- `POST /api/auth/logout` clears that cookie.
- `GET /api/auth/me` returns the signed-in user.
- `GET /api/tickets` and `POST /api/tickets` list and create tickets.
- `GET /api/tickets/[id]` and `DELETE /api/tickets/[id]` read and delete one ticket.
- `POST /api/tickets/[id]/resolve` marks a ticket resolved.

Handlers authenticate the request, pass input to the service, and map records with `toTicketResponse`.

## Service

`src/server/tickets/ticket.service.ts` creates tickets, lists them, resolves them, and deletes them.

Access rule, in `assertCanAccess`: the creator or any `AGENT` may view, resolve, and delete a ticket. A `USER` list contains only tickets they created. An `AGENT` list contains every ticket. Resolving a ticket that is already `RESOLVED` returns a conflict.

## Data access

`src/server/tickets/ticket.repository.ts` is the only module that queries tickets. The selected columns and `toRecord` are explicit.

## Prisma / database

`prisma/schema.prisma` defines `User` and `Ticket`. The database is a local SQLite file, `prisma/dev.db`. Migrations live in `prisma/migrations`. `prisma.config.ts` loads `.env` and points Prisma at `prisma/seed.ts`, which inserts the development accounts and the five known tickets when those ids are absent.

## Validation flow

1. The route reads the JSON body.
2. `validateCreateTicketInput` checks required text.
3. On failure it throws `AppError` with code `VALIDATION_ERROR`.
4. The route returns HTTP 400:

```json
{ "error": "VALIDATION_ERROR", "message": "Title is required." }
```

The same two property names are used for `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, and `CONFLICT`. Unexpected failures return `INTERNAL`.
