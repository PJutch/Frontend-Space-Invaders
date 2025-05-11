import { Hono } from 'hono';
import { serveStatic } from 'hono/deno';

const app = new Hono();
const kv = await Deno.openKv();

app.use('*', serveStatic({ root: './static' }));

app.get('/api/score', async (c) => {
    const iter = await kv.list({ prefix: ['score'] });
    const scoreList = [];
    for await (const res of iter) scoreList.push(res.value);
    return c.json(scoreList);
});

app.post('/api/score', async (c) => {
    console.log(await c.req.text());
    const body = await c.req.json();
    const result = await kv.set(['score', body.nickname], body);
    return c.json(result);
});

Deno.serve(app.fetch);
