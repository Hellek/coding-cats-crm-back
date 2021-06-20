import './ENV'
import { migrate } from 'postgres-migrations'
import { pool } from './DB'

async function run() {
	let client = null

	try {
		client = await pool.connect()
		await migrate({ client }, './src/core/migrations')
		client.release()
	} catch (error) {
		client.release()
		console.log(error)
		process.exit(1)
	}
}

run()