import koaRouter from 'koa-router'
import AuthModel from './model'
import UsersModel from '../users/model'

const router = new koaRouter()
const Auth = new AuthModel
const Users = new UsersModel

router.post('/authenticate', async ctx => {
	try {
		const user = await Auth.authentication(ctx.request.body)
		const token = await Auth.getJwtToken({ user })
		ctx.body = token
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.post('/refresh', async ctx => {
	try {
		const user = await Users.getBy('id', {
			id: ctx.state.user.id,
			requestor: ctx.state.user,
		})

		ctx.body = await Auth.getJwtToken({ user })
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.post('/password/reset', async ctx => {
	try {
		await Auth.resetPassword(ctx.request.body)
		ctx.body = 'Мы выслали данные для сброса пароля (если вы регистрировались ранее)'
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
