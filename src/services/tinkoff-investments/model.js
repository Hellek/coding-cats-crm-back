// https://github.com/TinkoffCreditSystems/invest-openapi-js-sdk/blob/master/doc/classes/openapi.md
import OpenAPI from '@tinkoff/invest-openapi-js-sdk'
import DB from '../../core/DB'

class TinkoffInvestments {
	constructor() {
		this.instruments = {}
		this.brokerEstablishDate = '2016-01-01T00:00:00+00:00'
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
}

class TinkoffInvestmentsLocal extends TinkoffInvestments {
}

export { TinkoffInvestments, TinkoffInvestmentsLocal}
