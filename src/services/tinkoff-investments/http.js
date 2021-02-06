import koaRouter from 'koa-router'
import TinkoffInvestmentsModel from './model'

const router = new koaRouter()
const TinkoffInvestments = new TinkoffInvestmentsModel

router.get('/accounts', async ctx => {
	try {
		ctx.body = await TinkoffInvestments.accounts({
			user: ctx.state.user,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.get('/operations', async ctx => {
	try {
		ctx.body = await TinkoffInvestments.operations({
			user: ctx.state.user,
			...ctx.query,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.get('/portfolio', async ctx => {
	try {
		ctx.body = await TinkoffInvestments.portfolio({
			user: ctx.state.user,
			...ctx.query,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.get('/instruments/:type', async ctx => {
	try {
		ctx.body = await TinkoffInvestments.getInstruments({
			user: ctx.state.user,
			type: ctx.params.type,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

export default router.routes()
