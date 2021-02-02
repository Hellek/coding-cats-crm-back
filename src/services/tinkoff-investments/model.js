// https://github.com/TinkoffCreditSystems/invest-openapi-js-sdk/blob/master/doc/classes/openapi.md
import OpenAPI from '@tinkoff/invest-openapi-js-sdk'

class TinkoffInvestments {
	constructTikkoffApi({ isRealMode = true, user }) {
		const apiURL = isRealMode ? 'https://api-invest.tinkoff.ru/openapi' : 'https://api-invest.tinkoff.ru/openapi/sandbox/'
		// const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws'
		const secretToken = isRealMode ? user.TIRealToken : user.TISandboxToken

		return new OpenAPI({
			apiURL,
			secretToken,
			// socketURL,
		})
	}

	async accounts({ user }) {
		const api = this.constructTikkoffApi({ user })

		return (await api.accounts()).accounts
	}

	async getInstruments({ user, type }) {
		const api = this.constructTikkoffApi({ user })

		return (await api[type]()).instruments
	}

	async operations({
		user,
		from = null,
		to = null,
		figi = undefined,
	}) {
		const api = this.constructTikkoffApi({ user })

		return (await api.operations({ from, to, figi })).operations
	}

	async portfolio({ user }) {
		const api = this.constructTikkoffApi({ user })

		return await api.portfolio()
	}
}

export default TinkoffInvestments
