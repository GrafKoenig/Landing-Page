import { getClient } from './_db.js';

export default async function handler(req, res) {
  const key = req.query.key;

  if (!process.env.EXPORT_SECRET || key !== process.env.EXPORT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = getClient();

  try {
    await client.connect();

    const { rows } = await client.sql`SELECT email, created_at FROM subscribers ORDER BY created_at ASC`;

    const lines = ['email,created_at'];
    for (const row of rows) {
      lines.push(`${row.email},${new Date(row.created_at).toISOString()}`);
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    return res.status(200).send(lines.join('\n'));
  } catch (err) {
    console.error('export error', err);
    return res.status(500).json({ error: 'Internal error' });
  } finally {
    await client.end();
  }
}
