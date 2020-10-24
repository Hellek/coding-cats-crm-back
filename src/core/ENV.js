import dotenv from 'dotenv'

const ENV = dotenv.config({ path: `./.env.${process.env.NODE_ENV}` }).parsed

ENV.HAS_AUTH_SERVICE = JSON.parse(ENV.HAS_AUTH_SERVICE)
ENV.ALLOWED_ORIGINS = JSON.parse(ENV.ALLOWED_ORIGINS)
ENV.DATABASE = JSON.parse(ENV.DATABASE)

global.ENV = ENV
