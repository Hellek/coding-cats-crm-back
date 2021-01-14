import koaRouter from 'koa-router'
import InstrumentsModel from './model'

const router = new koaRouter()
const Instruments = new InstrumentsModel

/* Получить инструмент по фильтру */
router.get('/', async ctx => {
	try {
		ctx.body = await Instruments.getList({ queryString: ctx.request.query.queryString })
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

export default router.routes()
