import koaRouter from 'koa-router'
import {
	TinkoffInvestments as TIM,
	TinkoffInvestmentsLocal as TILM,
} from './model'

const router = new koaRouter()
const TinkoffInvestments = new TIM
const TinkoffInvestmentsLocal = new TILM

router.get('/accounts', async ctx => {
	try {
		ctx.body = await TinkoffInvestments.fetchAccounts({
			user: ctx.state.user,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.post('/operations/sync', async ctx => {
	try {
		ctx.body = await TinkoffInvestmentsLocal.syncOperations({
			user: ctx.state.user,
			...ctx.request.body,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.get('/operations', async ctx => {
	try {
		ctx.body = await TinkoffInvestmentsLocal.getOperations({
			user: ctx.state.user,
			...ctx.query,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.get('/used-instruments', async ctx => {
	try {
		ctx.body = await TinkoffInvestmentsLocal.getUsedInstruments({
			user: ctx.state.user,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.get('/portfolio', async ctx => {
	try {
		ctx.body = await TinkoffInvestments.fetchPortfolio({
			user: ctx.state.user,
			...ctx.query,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.get('/portfolio/instrument', async ctx => {
	try {
		ctx.body = await TinkoffInvestments.fetchInstrumentPortfolio({
			user: ctx.state.user,
			...ctx.query,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.get('/instruments/:type', async ctx => {
	try {
		ctx.body = await TinkoffInvestments.fetchInstruments({
			user: ctx.state.user,
			type: ctx.params.type,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

export default router.routes()
