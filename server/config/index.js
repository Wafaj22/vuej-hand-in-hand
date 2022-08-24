require('dotenv').config();

module.exports = {
    SECRET: process.env.APP_SECRET,
    DB: process.env.APP_DB,
    PORT: process.env.APP_PORT,
    DOMAIN: process.env.APP_DOMAIN,
    KEY: process.env.APP_KEY,
    EMAIL: process.env.APP_EMAIL,
    STRIPE_SECRET_KEY: process.env.APP_STRIPE_SECRET_KEY,
    ENDPOINT_SECRET: process.env.APP_ENDPOINT_SECRET
};