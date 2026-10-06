# Trainer fault injection

Do not apply this to the prepared baseline. Introduce it only after the participant has a working ticket priority feature.

The agreed response property is `priority`. This fault breaks only the ticket list response.

## Fault

In `src/app/api/tickets/route.ts`, change the `GET` handler so the list maps `priority` to `ticket_priority`.

Baseline line:

```ts
return Response.json({ tickets: tickets.map(toTicketResponse) });
```

After `priority` exists on the ticket response, replace that line with:

```ts
return Response.json({
  tickets: tickets.map((ticket) => {
    const response = toTicketResponse(ticket);
    const { priority, ...rest } = response;
    return { ...rest, ticket_priority: priority };
  }),
});
```

Leave create, detail, resolve, and the database value alone. Those should still use `priority`.

## Expected effect

- A list API test that expects `priority` fails.
- The ticket list in the browser reads `priority`, so the priority column is empty or wrong.
- Create, resolve, and delete can still succeed.

## Revert

Restore:

```ts
return Response.json({ tickets: tickets.map(toTicketResponse) });
```

The edit is local to that participant copy. It does not delete rows or change the schema.
