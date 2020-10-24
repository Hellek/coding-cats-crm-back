import koaRouter from 'koa-router'
import setServiceRoutes from './routes'

const router = new koaRouter()

router.get('/favicon.ico', async ctx => ctx.response.status = 204)

// Error handler
router.use(async function (ctx, next) {
	try {
		await next()
	} catch (err) {
		ctx.status = err.statusCode || err.status || 500
		ctx.body = err.message || 'Some error goes here'
	}
})

// Checking "service & method" existance in route
router.all('/:service?/:method?', async (ctx, next) => {
	if (ctx.params.service === undefined) {
		ctx.status = 400
		ctx.message = 'Service not specified'
	} else {
		await next()
	}
})

setServiceRoutes(router)

export default router
