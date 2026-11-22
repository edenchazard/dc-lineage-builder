import type { RowDataPacket } from 'mysql2';

import { databaseTransaction } from '../../db.js';

const table = 'saved_lineages';

export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Seed the saved_lineages table with sample data',
  },
  async run() {
    const count = await databaseTransaction(async (transaction) => {
      await transaction.execute(`TRUNCATE TABLE ${table}`);

      await transaction.execute(`
        INSERT INTO ${table} (hash, content) VALUES
          ('9f75eac68046e85c537f61aac737514bcedb8e2b', '{"code":"eGkpN","name":"Harriette Apricot","parents":{"m":{"code":"HZkFI","name":"Margaretha Magenta","parents":{},"breed":"Aegis Enraged","gender":"m","display":1},"f":{"code":"ptaTL","name":"Wanda Coffee","parents":{},"breed":"Alcedine Wyvern Brown","gender":"f","display":1}},"breed":"Aegis Enraged","gender":"m","display":1}'),
          ('b7d0a70f7426f7139d89d083e70c93fc30a50bfc', '{"code":"eGkpN","name":"Harriette Apricot","parents":{"m":{"code":"HZkFI","name":"Margaretha Magenta","parents":{"m":{"code":"HvJhG","name":"Ann Sapphire","parents":{},"breed":"Copper Pennybright","gender":"m","display":1},"f":{"code":"G9GNw","name":"Elga Blush","parents":{},"breed":"Leodon","gender":"f","display":1}},"breed":"Copper Pennybright","gender":"m","display":1},"f":{"code":"ptaTL","name":"Wanda Coffee","parents":{"m":{"code":"MVWvi","name":"Rosie Beige","parents":{},"breed":"Copper Pennybright","gender":"m","display":1},"f":{"code":"W28H9","name":"Shaylah Jade","parents":{},"breed":"Leodon","gender":"f","display":1}},"breed":"Leodon","gender":"f","display":1}},"breed":"Copper Pennybright","gender":"m","display":1}')
      `);

      const [rows] = await transaction.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS row_count FROM ${table}`,
      );

      return rows[0]?.row_count ?? 0;
    });

    return { result: `Seeded ${count} lineages` };
  },
});
