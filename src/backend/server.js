let GLOBALS = require('./globals.js');
const config = require('./config.js');
const mysql = require('mysql2/promise');

const Koa = require('koa');
/*const serve = require('koa-static');
const mount = require('koa-mount');
const send  = require('koa-send');*/
const bodyParser = require('koa-bodyparser');

const apirouter  = require('./router-api.js');

const app = new Koa();

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch(err) {
        console.log(err.status)
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
});

//app.use(serve("/frontend"));
app
    .use(bodyParser())
    .use(apirouter.routes())
    .use(apirouter.allowedMethods());

GLOBALS.pool = mysql.createPool({
    ...config.db,
    waitForConnections: true
});

app.listen(config.port);

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});