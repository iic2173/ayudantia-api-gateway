const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('@koa/cors');

const corsOptions = {
  origin: '*',
  allowHeaders: ['*', 'Auth'],
};

const app = new Koa();
app.use(cors(corsOptions));
app.use(bodyParser());

const router = new Router();

router
  .get('/', (ctx, next) => {
    ctx.body = {
      message: 'Hello World!'
    };
  })
  .get('/header', (ctx, next) => {
    ctx.body = {
      header: { Auth: ctx.request.get('Auth') },
    }
  })
  .post('/', (ctx, next) => {
    // handle your post request here
    ctx.body = ctx.request.body;
  })

app
  .use(router.routes())
  .use(router.allowedMethods());

console.log('Listening port 3001');
app.listen(3001);