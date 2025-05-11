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
    const body = await c.req.json();
    const oldBody = (await kv.get(['score', body.nickname])).value;
    
    if (!oldBody || body.score > oldBody.score) {
        const result = await kv.set(['score', body.nickname], body);
        result.updated = true;
        return c.json(result);
    } else {
        return c.json({updated: false});
    }
});

Deno.serve(app.fetch);
