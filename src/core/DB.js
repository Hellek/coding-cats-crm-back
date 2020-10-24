import { Pool } from 'pg'

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
/* pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err)
	process.exit(-1)
})
 */
const pool = new Pool({
	database: global.ENV.DATABASE.name,
	user: global.ENV.DATABASE.user,
	password: global.ENV.DATABASE.pass,
	port: global.ENV.DATABASE.port,
	// ssl: true,
	// max: 20, // set pool max size to 20
	// idleTimeoutMillis: 1000, // close idle clients after 1 second
	// connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
	// maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
})

/* const pool = require('mysql2/promise').createPool({
	host: env.database.host,
	database: env.database.name,
	charset: 'UTF8MB4_UNICODE_CI',
	user: env.database.user,
	password: env.database.pass,
	timezone: 'Z',
	namedPlaceholders: true,
})
*/

export default {
	async query(text, params) {
		try {
			return await pool.query(text, params)
		} catch (error) {
			if (error.code === 'ECONNREFUSED') throw Error('Ошибка подключения к БД')
			throw error
		}
	},
}