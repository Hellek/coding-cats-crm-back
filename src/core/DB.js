import { Pool } from 'pg'

const pool = new Pool({
	host: global.ENV.DATABASE.host,
	database: global.ENV.DATABASE.name,
	user: global.ENV.DATABASE.user,
	password: global.ENV.DATABASE.pass,
	port: global.ENV.DATABASE.port,
})

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