let GLOBALS = require('./globals.js');
const config = require('./config.js');
//const path = require('path');
const mysql = require('mysql2/promise');

const Koa = require('koa');
/*const serve = require('koa-static');
const mount = require('koa-mount');
const send  = require('koa-send');*/
const bodyParser = require('koa-bodyparser');

//const { historyApiFallback } = require('koa2-connect-history-api-fallback');

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
    .use(apirouter.allowedMethods())
/*
app.use(function* index() {
    yield send(this, __dirname + '/frontend/index.html');
  });*/
//    use(router.routes())
//    .use(router.allowedMethods()
// routes prepared.
// create db connection and online the server
//function handleDisconnect() {
GLOBALS.pool = mysql.createPool({
    port: config.db.port,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: config.db.connectionLimit
});

    /*.then((con) => {
        GLOBALS.connection = con;
        /*GLOBALS.connection.on('error', function(err){
            console.log('db error', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
                handleDisconnect();
            }
        });//
    })
    .catch((err) => {
        setTimeout(handleDisconnect, 2000);
    });*/

app.listen(config.port);
//handleDisconnect();
//app.listen(config.port);

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});