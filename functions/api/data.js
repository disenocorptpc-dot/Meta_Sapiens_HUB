/**
 * Cloudflare Pages Function — API de datos compartidos
 * Ruta: /api/data
 *
 * GET  /api/data?key=ms_checklist   → devuelve el valor
 * POST /api/data                    → body: { key, value } → guarda
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')

  if (!key) {
    // Devolver TODAS las claves de una vez
    const { results } = await env.meta_sapiens_db.prepare(
      'SELECT key, value FROM hub_data'
    ).all()

    const data = {}
    for (const row of results) {
      try { data[row.key] = JSON.parse(row.value) }
      catch { data[row.key] = row.value }
    }
    return Response.json(data, { headers: CORS })
  }

  const row = await env.meta_sapiens_db.prepare(
    'SELECT value FROM hub_data WHERE key = ?'
  ).bind(key).first()

  if (!row) return Response.json(null, { headers: CORS })

  try {
    return Response.json(JSON.parse(row.value), { headers: CORS })
  } catch {
    return Response.json(row.value, { headers: CORS })
  }
}

export async function onRequestPost({ request, env }) {
  const { key, value } = await request.json()

  if (!key) {
    return Response.json({ error: 'key required' }, { status: 400, headers: CORS })
  }

  await env.meta_sapiens_db.prepare(
    `INSERT INTO hub_data (key, value, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       updated_at = CURRENT_TIMESTAMP`
  ).bind(key, JSON.stringify(value)).run()

  return Response.json({ ok: true }, { headers: CORS })
}
