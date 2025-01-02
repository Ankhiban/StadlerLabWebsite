// config/config.js
require('dotenv').config();

const config = {
    production: {
        mongodb: {
            uri: process.env.MONGODB_URI,
            options: {
                maxPoolSize: 50,
                wtimeoutMS: 2500,
                useNewUrlParser: true
            }
        }
    },
    development: {
        mongodb: {
            uri: process.env.MONGODB_URI_DEV,
            options: {
                maxPoolSize: 10,
                wtimeoutMS: 2500,
                useNewUrlParser: true
            }
        }
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];