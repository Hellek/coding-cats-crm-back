import { Pool } from 'pg'

const pool = new Pool({
	database: global.ENV.DATABASE.name,
	user: global.ENV.DATABASE.user,
	password: global.ENV.DATABASE.pass,
	port: global.ENV.DATABASE.port,
})

export default pool
