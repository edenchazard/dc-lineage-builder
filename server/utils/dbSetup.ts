import { databaseTransaction, pool } from '../db.js';

const table = 'saved_lineages';

/** Recreates the lineage table from scratch. */
export async function freshDatabase(): Promise<void> {
  await pool.execute(`DROP TABLE IF EXISTS ${table}`);

  await databaseTransaction(async (transaction) => {
    await transaction.execute(`
      CREATE TABLE IF NOT EXISTS ${table} (
        id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        hash char(40) NOT NULL,
        last_view date NOT NULL DEFAULT (CURRENT_DATE),
        hits smallint(5) UNSIGNED NOT NULL DEFAULT 0,
        content json NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY hash (hash)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `);
  });
}
