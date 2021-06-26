// https://github.com/TinkoffCreditSystems/invest-openapi-js-sdk/blob/master/doc/classes/openapi.md
import OpenAPI from '@tinkoff/invest-openapi-js-sdk'
import dayjs from 'dayjs'
import DB from '../../core/DB'

class TinkoffInvestments {
	constructor() {
		this.instruments = {}
		this.brokerEstablishDate = dayjs('2016-01-01').toISOString()
	}

	#constructTikkoffApi = ({
		isRealMode = true,
		user,
		brokerAccountId = null,
	}) => {
		const apiURL = isRealMode ? 'https://api-invest.tinkoff.ru/openapi' : 'https://api-invest.tinkoff.ru/openapi/sandbox/'
		// const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws'
		const secretToken = isRealMode ? user.TIRealToken : user.TISandboxToken

		return new OpenAPI({
			apiURL,
			secretToken,
			// socketURL,
			brokerAccountId,
		})
	}

	async fetchAccounts({ user }) {
		const api = this.#constructTikkoffApi({ user })

		return (await api.accounts()).accounts
	}

	async fetchInstruments({ user, type }) {
		// TODO сейчас локальное кэширование в памяти, проверить быстрее ли через БД
		if (this.instruments[type] && this.instruments[type].length) return this.instruments[type]

		const api = this.#constructTikkoffApi({ user })

		this.instruments[type] = (await api[type]()).instruments

		return this.instruments[type]
	}

	async fetchOperations({
		user,
		from = null,
		to = null,
		figi = undefined,
		brokerAccountId = null,
	}) {
		const api = this.#constructTikkoffApi({ user, brokerAccountId })
		const figiStrict = figi || undefined

		return (await api.operations({
			from,
			to,
			figi: figiStrict,
		})).operations
	}

	async fetchPortfolio({
		user,
		brokerAccountId,
	}) {
		const api = this.#constructTikkoffApi({ user, brokerAccountId })

		return await api.portfolio()
	}

	async fetchInstrumentPortfolio({
		user,
		brokerAccountId,
		figi,
	}) {
		const api = this.#constructTikkoffApi({ user, brokerAccountId })

		return await api.instrumentPortfolio({ figi })
	}
}

class TinkoffInvestmentsLocal extends TinkoffInvestments {
	#getInsertOperationSql = op => {
		const text = `INSERT INTO operations (
			userId,
			id,
			status,
			figi,
			"operationType",
			payment,
			currency,
			quantity,
			"quantityExecuted",
			price,
			"instrumentType",
			date,
			"isMarginCall",
			commission,
			trades
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT (id, userId) DO NOTHING;`

		const values = [
			op.userId,
			op.id,
			op.status,
			op.figi,
			op.operationType,
			op.payment,
			op.currency,
			op.quantity,
			op.quantityExecuted,
			op.price,
			op.instrumentType,
			op.date,
			op.isMarginCall,
			op.commission,
			op.trades,
		]

		return { text, values }
	}

	async getNewestOperationDate({ user }) {
		const text = `SELECT MAX(date) FROM operations WHERE userId=$1`
		const values = [user.id]
		const { rows } = await DB.query(text, values)

		return rows[0].max
	}

	async getOperations({
		user,
		from = null,
		to = null,
		figi = undefined,
		brokerAccountId = null,
	}) {
		let index = 1
		let whereConditions = ''
		const values = [user.id]

		if (figi) {
			whereConditions += ` AND figi=$${++index}`
			values.push(figi)
		}

		if (from) {
			whereConditions += ` AND date>=$${++index}`
			values.push(from)
		}

		if (to) {
			whereConditions += ` AND date<=$${++index}`
			values.push(to)
		}

		let text = `SELECT * FROM operations WHERE userId=$1${whereConditions} ORDER BY date DESC`

		const { rows } = await DB.query(text, values)

		return rows
	}

	async addOperation(op) {
		const { text, values } = this.#getInsertOperationSql(op)

		return await DB.query(text, values)
	}

	async syncOperations({ user, brokerAccountId }) {
		let accounts = []

		if (!brokerAccountId) {
			accounts = await this.fetchAccounts({ user })
			brokerAccountId = accounts.find(acc => acc.brokerAccountType === 'Tinkoff').brokerAccountId
		}

		let from = dayjs(this.brokerEstablishDate)
		const to = dayjs().add(1, 'month')
		const newestOperationDate = await this.getNewestOperationDate({ user })

		if (newestOperationDate) {
			from = dayjs(newestOperationDate).add(1, 'millisecond')
		}

		const diffCount = to.diff(from, 'month')
		let added = 0

		for (let index = 0; index < diffCount; index++) {
			const iterationFrom = from.add(Math.abs(index), 'month')
			const iterationTo = from.add(Math.abs(index + 1), 'month')

			const fetchedOperations = await this.fetchOperations({
				user,
				from: iterationFrom.toISOString(),
				to: iterationTo.toISOString(),
				brokerAccountId,
			})

			await Promise.all(fetchedOperations.map(operation => {
				return this.addOperation({ userId: user.id, ...operation })
			}))

			added += fetchedOperations.length
		}

		return { added }
	}

	async getUsedInstruments({
		user,
	}) {
		let index = 1
		let text = `SELECT DISTINCT figi FROM operations WHERE userId=$${index}`
		const values = [user.id]

		const { rows } = await DB.query(text, values)

		return rows.map(row => row.figi)
	}

	async deleteOperation({ user }) {
		return 0 < (await DB.query('DELETE FROM operations WHERE userId=$1', [user.id])).rowCount
	}
}

export { TinkoffInvestments, TinkoffInvestmentsLocal}
