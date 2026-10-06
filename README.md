# Support Tickets

Local training application for Lab 5, Agentic Database Feature Development. Participants supervise a coding agent while it adds a feature across the database, service, API, UI, and tests.

The baseline already supports sign-in, ticket creation, listing, detail, resolution, and deletion. Ticket priority is intentionally absent.

## Stack

- Next.js 16 and React 19, App Router, TypeScript
- Prisma 6 and SQLite
- Vitest
- ESLint and Prettier

Exact versions are pinned in `package-lock.json`. Everything runs on this machine. There is no cloud service, external database, or deployment step.

## Setup

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`.env` is included and contains only development values:

```text
DATABASE_URL="file:./dev.db"
SESSION_SECRET="dev-only-change-me-not-a-real-secret"
```

Copy `.env.example` to `.env` if that file is missing. `file:./dev.db` is resolved from `prisma/`, so the database file is `prisma/dev.db`.

## Database

```bash
npm run db:migrate      # apply committed migrations
npm run db:migrate:dev  # create a new migration while developing
npm run db:seed         # insert missing seed users and tickets
npm run db:setup        # migrate, then seed
npm run db:inspect      # print id, status, creator, and title
```

`npm run db:reset` drops the local database, reapplies migrations, and seeds again. Do not use it to recover a participant database. See [trainer/PREP.md](trainer/PREP.md).

Seeded tickets:

| ID         | Status   | Created by  | Title                              |
| ---------- | -------- | ----------- | ---------------------------------- |
| `tkt_1001` | OPEN     | `usr_user`  | Password reset email never arrives |
| `tkt_1002` | OPEN     | `usr_user`  | Laptop fan runs loudly             |
| `tkt_1003` | RESOLVED | `usr_user`  | VPN disconnects after 10 minutes   |
| `tkt_1004` | OPEN     | `usr_user`  | Badge reader rejects a valid badge |
| `tkt_1005` | RESOLVED | `usr_agent` | Conference room display is blank   |

Re-running the seed updates the two development accounts and inserts a seed ticket only when its id is missing. It does not delete tickets created in the app.

## Development accounts

These are fictional. Do not reuse the password anywhere else.

| Email               | Role  | Password      | What they see          |
| ------------------- | ----- | ------------- | ---------------------- |
| `user@example.com`  | USER  | `password123` | Only their own tickets |
| `agent@example.com` | AGENT | `password123` | Every ticket           |

The creator or any agent can view, resolve, and delete a ticket. Resolving a ticket that is already resolved returns a conflict.

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
npm run check
```

`npm run check` runs typecheck, lint, format check, and tests. Tests use a separate file, `prisma/test.db`, and do not modify `prisma/dev.db`.

## Validation

Invalid API input returns HTTP 400:

```json
{ "error": "VALIDATION_ERROR", "message": "Title is required." }
```

Keep the property names `error` and `message`. Other failures use the same shape with `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, or `CONFLICT`.

## Restore a clean training copy

Stop the app, then follow [trainer/PREP.md](trainer/PREP.md). A backup of `prisma/dev.db` is the snapshot to compare after a later migration. `npm run db:reset` is a different, destructive operation.

## Layout

See [ARCHITECTURE.md](ARCHITECTURE.md). Agent instructions for later work are in [AGENTS.md](AGENTS.md).

## Not in this baseline

Priority, priority editing, filtering, sorting, comments, notifications, file uploads, real-time updates, and deployment are out of scope.
