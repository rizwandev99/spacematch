const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`SELECT title, slug, image_url FROM listings LIMIT 2`;
  console.log(rows);
}
main();
