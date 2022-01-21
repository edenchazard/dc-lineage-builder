let file = './config.development.js';
switch(process.env.NODE_ENV){
    case 'development':
        file = './config.development.js';
        break;
    case 'production':
        file = './config.production.js';
        break;
}

module.exports = require(file);