import { Pool } from 'pg'

const dbSettings = JSON.parse(process.env.DATABASE)

const ssl = process.env.ENV === 'development' ? false : { rejectUnauthorized: false }

export const pool = new Pool({
	host: dbSettings.host,
	database: dbSettings.name,
	user: dbSettings.user,
	password: dbSettings.pass,
	port: dbSettings.port,
	ssl,
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