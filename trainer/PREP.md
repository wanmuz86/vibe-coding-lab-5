# Trainer preparation

Use this before class to freeze a known database, and again if a participant needs that snapshot back.

## Create the training database

```bash
npm install
npm run db:setup
npm run db:inspect
```

Record the printed ids, statuses, and titles. The seed ids are stable:

| ID         | Status   | Created by  | Title                              |
| ---------- | -------- | ----------- | ---------------------------------- |
| `tkt_1001` | OPEN     | `usr_user`  | Password reset email never arrives |
| `tkt_1002` | OPEN     | `usr_user`  | Laptop fan runs loudly             |
| `tkt_1003` | RESOLVED | `usr_user`  | VPN disconnects after 10 minutes   |
| `tkt_1004` | OPEN     | `usr_user`  | Badge reader rejects a valid badge |
| `tkt_1005` | RESOLVED | `usr_agent` | Conference room display is blank   |

## Keep a backup

```bash
cp prisma/dev.db trainer/fixtures/pre-lab-dev.db
```

`trainer/fixtures/*.db` is gitignored. Copy that file with each participant's project if you want them to start from this exact file. A fresh `npm run db:setup` recreates the same five ids only when those ids are missing. It does not overwrite a ticket that already exists, and it does not delete tickets created later.

Give each participant their own copy of the repository and database. Do not share one `prisma/dev.db` between people.

## Restore the snapshot

1. Stop the app.
2. Replace the current file:

```bash
cp trainer/fixtures/pre-lab-dev.db prisma/dev.db
```

3. Start the app again.

Do not run `npm run db:reset` for this restore. Reset drops the database, reapplies migrations, and runs the seed. That removes tickets created during class.

## After a later priority migration

Compare the backup with the migrated database:

- the same ids are present
- title and status are unchanged
- the new priority value is Medium on the rows that already existed

`npm run db:inspect` prints id, status, creator, and title. It does not print columns added later until that script is updated. A direct query can show the new column:

```bash
sqlite3 prisma/dev.db "SELECT id, title, status, priority FROM Ticket ORDER BY id;"
```
