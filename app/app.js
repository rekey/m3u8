const Koa = require('koa');
const Router = require('koa-router');

const storeSvc = require('./service/store.js');
const madouSvc = require('./service/madou.js');

const app = new Koa();
const router = new Router();

router.get('/api/task/list', async (ctx) => {
    ctx.body = storeSvc.all();
});

router.get('/api/task/add', async (ctx) => {
    storeSvc.add(ctx.query.url);
    ctx.body = storeSvc.all();
});

app.use(router.routes());

app.listen(61001);

madouSvc.start();

function handle(signal) {
    console.log('signal', signal);
    process.exit(0);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
