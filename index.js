const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('@koa/cors');

const corsOptions = {
  origin: '*',
  allowHeaders: ['Access-Control-Allow-Headers', 'Origin','Accept', 'X-Requested-With', 'Content-Type', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Auth'],
  allowMethods: ['GET','HEAD','OPTIONS', 'PUT','POST','DELETE','PATCH'],
};

const app = new Koa();
app.use(cors(corsOptions));
app.use(bodyParser());

const router = new Router();

router
  .get('/', (ctx, next) => {
    console.log('[i] GET /')
    ctx.body = {
      message: 'Hello World!'
    };
  })
  .get('/header', (ctx, next) => {
    console.log('[i] GET /header')
    ctx.body = {
      header: { Auth: ctx.request.get('Auth') },
    }
  })
  .post('/', (ctx, next) => {
    console.log('[i] POST /')
    // handle your post request here
    ctx.body = ctx.request.body;
  })

app
  .use(router.routes())
  .use(router.allowedMethods());

console.log('Listening port 3001');
app.listen(3001);