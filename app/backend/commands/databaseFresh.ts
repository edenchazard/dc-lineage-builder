import pool from '../pool.js';

const table = 'saved_lineages';

const con = await pool.getConnection();

await con.execute(`DROP TABLE IF EXISTS ${table}`);

await con.beginTransaction();

await con.execute(`
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

await con.commit();

con.release();

process.exit(0);
