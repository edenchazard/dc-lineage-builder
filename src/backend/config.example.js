module.exports = {
    port: 8080,
    db:{
        port: 3306,
        host: "db",
        user: 'username',
        database: 'dbname',
        password: 'password',
        connectionLimit: 10
    },
    salt: "salt",
    apiPath: "/api",
    default_error: { status: 2, message: "Sorry, an error has occurred." }
}