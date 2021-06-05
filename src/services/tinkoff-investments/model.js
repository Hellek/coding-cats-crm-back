// https://github.com/TinkoffCreditSystems/invest-openapi-js-sdk/blob/master/doc/classes/openapi.md
import OpenAPI from '@tinkoff/invest-openapi-js-sdk'

class TinkoffInvestments {
	constructor() {
		this.instruments = {}
	}

	constructTikkoffApi({
		isRealMode = true,
		user,
		brokerAccountId = null,
	}) {
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

	async accounts({ user }) {
		const api = this.constructTikkoffApi({ user })

		return (await api.accounts()).accounts
	}

	async getInstruments({ user, type }) {
		// TODO сейчас локальное кэширование в памяти, проверить быстрее ли через БД
		if (this.instruments[type] && this.instruments[type].length) return this.instruments[type]

		const api = this.constructTikkoffApi({ user })

		this.instruments[type] = (await api[type]()).instruments

		return this.instruments[type]
	}

	async operations({
		user,
		from = null,
		to = null,
		figi = undefined,
		brokerAccountId = null,
	}) {
		const api = this.constructTikkoffApi({ user, brokerAccountId })
		const figiStrict = figi || undefined

		return (await api.operations({
			from,
			to,
			figi: figiStrict,
		})).operations
	}

	async portfolio({
		user,
		brokerAccountId,
	}) {
		const api = this.constructTikkoffApi({ user, brokerAccountId })

		return await api.portfolio()
	}

	async portfolioCurrencies({ user }) {
		// const api = this.constructTikkoffApi({ user })
		// return (await api.accounts()).accounts
	}

	async search({ user }) {
		// const api = this.constructTikkoffApi({ user })
		// return (await api.accounts()).accounts
		// ▸ search(params: InstrumentId): Promise‹MarketInstrumentList›
		// Метод для поиска инструментов по figi или ticker
	}

	async test({ user }) {
		/* const isRealMode = false
		const apiURL = isRealMode ? 'https://api-invest.tinkoff.ru/openapi' : 'https://api-invest.tinkoff.ru/openapi/sandbox/'
		const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws'
		const secretToken = isRealMode ? user.TIRealToken : user.TISandboxToken

		const api = new OpenAPI({
			apiURL,
			secretToken,
			socketURL,
		})

		await api.sandboxClear()

		const marketInstrument = await api.searchOne({ ticker: 'AAPL' })

		return marketInstrument

		console.log(MarketInstrument) */

		// const { figi } = marketInstrument
		// console.log(await api.setCurrenciesBalance({ currency: 'USD', balance: 1000 })); // 1000$ на счет
		// console.log(await api.portfolioCurrencies());
		// console.log(await api.instrumentPortfolio({ figi })); // В портфеле ничего нет
		// console.log(await api.limitOrder({ operation: 'Buy', figi, lots: 1, price: 100 })); // Покупаем AAPL
		// console.log(await api.instrumentPortfolio({ figi })); // Сделка прошла моментально
		// console.log(await api.orderbookGet({ figi })); // получаем стакан по AAPL
	}
}

export default TinkoffInvestments
