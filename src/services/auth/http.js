import koaRouter from 'koa-router'
import AuthModel from './model'

const router = new koaRouter()
const Auth = new AuthModel

router.post('/login', async ctx => {
	try {
		if (!ctx.session.authorized) {
			ctx.session.user = await Auth.authentication(ctx.request.body)
			ctx.session.authorized = true
		}

		ctx.status = 200
		ctx.body = ctx.session.user
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.post('/logout', async ctx => {
	ctx.session = null
	ctx.status = 200
})

router.post('/reset', async ctx => {
	try {
		await Auth.reset(ctx.request.body)
		ctx.status = 200
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.put('/password', async ctx => {
	try {
		await Auth.setPassword(ctx.request.body)
		ctx.status = 200
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

export default router.routes()
