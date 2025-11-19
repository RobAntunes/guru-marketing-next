import { defineDb, defineTable, column } from 'astro:db';

const Subscribers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    email: column.text({ unique: true }),
    createdAt: column.date({ default: new Date() }),
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: { Subscribers }
});
