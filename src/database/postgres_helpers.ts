import pg from "pg";

const {Pool} = pg;


const pgPool = new Pool({
  connectionString: "postgresql://example:example@localhost:5432/example",
})

export async function saveToTable(tableName: string, items: any[]): Promise<void> {
  let client = await pgPool.connect()

  try {
    for (const item of items) {
      let keys = Object.keys(item).map(k => k.toLowerCase())
      let values = Object.values(item)
      let columns = keys.map((key) => `"${key}"`).join(',')
      let placeholders = keys.map((_, i) => `$${i + 1}`).join(',')

      let query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) ON CONFLICT (name) DO NOTHING`

      await client.query(query, values)
    }
  } finally {
    await client.release()
  }
}
