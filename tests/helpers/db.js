import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

let pool;

function getPool() {
  if (!pool) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 2,
      // Évite les BigInt (SELECT COUNT(*)) qui font planter JSON/expect
      bigIntAsNumber: true,
    });
  }
  return pool;
}

// Retourne un tableau de lignes (SELECT) ou { affectedRows, insertId } (INSERT/UPDATE/DELETE)
export async function query(sql, params = []) {
  return getPool().query(sql, params);
}

export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

// rows = tableau d'objets de mêmes clés → 1 seul batch INSERT
export async function insertMany(table, rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const sql = `INSERT INTO \`${table}\` (${cols.map(c => `\`${c}\``).join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`;
  return getPool().batch(sql, rows.map(r => cols.map(c => r[c])));
}

export async function deleteWhere(table, column, values) {
  return getPool().query(`DELETE FROM \`${table}\` WHERE \`${column}\` IN (?)`, [values]);
}

// Retourne la dernière ligne d'une table (objet) ou undefined si la table est vide.
// orderBy : colonne qui sert à définir « la dernière » (id auto-incrémenté ou date)
// where   : filtre optionnel { colonne: valeur }, ex. { player_uuid: '...' }
export async function selectLast(table, orderBy = 'id', where = {}) {
  const cols = Object.keys(where);
  const clause = cols.length ? ` WHERE ${cols.map(c => `\`${c}\` = ?`).join(' AND ')}` : '';
  const rows = await getPool().query(
    `SELECT * FROM \`${table}\`${clause} ORDER BY \`${orderBy}\` DESC LIMIT 1`,
    cols.map(c => where[c])
  );
  return rows[0];
}
