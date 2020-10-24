import dotenv from 'dotenv'

const ENV = dotenv.config({ path: `./.env.${process.env.NODE_ENV}` }).parsed

global.ENV = ENV
