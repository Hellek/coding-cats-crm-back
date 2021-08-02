import koaRouter from 'koa-router'
import koaJwt from 'koa-jwt'
import setServiceRoutes from './routes'

const router = new koaRouter()

router.get('/favicon.ico', async ctx => ctx.response.status = 204)

// Error handler
router.use(async function (ctx, next) {
	try {
		await next()
	} catch (error) {
		ctx.status = error.statusCode || error.status || 500
		ctx.body = error.message || 'Ошибка в работе сервера'
	}
})

// Checking "service & method" existance in route
router.all('/:service?/:method?', async (ctx, next) => {
	if (ctx.params.service === undefined) {
		ctx.status = 400
		ctx.message = 'Укажите "/${service}" в запрашиваемом маршруте'
	} else {
		await next()
	}
})

// Auth check
// TODO проверить верификацию
router.use(koaJwt({ secret: JSON.parse(process.env.SECRET_KEYS).jwt })
	.unless({ path: [/^\/external|auth\/(authenticate|password)(\/reset)?/] }))

setServiceRoutes(router)

export default router
