import koaRouter from 'koa-router'
import UsersModel from './model'

const router = new koaRouter()
const Users = new UsersModel

const httpErrorHandler = function (ctx, error) {
	if (error.message === '403') ctx.throw(403, 'Доступ запрещён')
	ctx.throw(400, error.message)
}

/* Получить список пользователей */
router.get('/', async ctx => {
	try {
		ctx.body = await Users.getList({
			filters: ctx.query,
			requestor: ctx.state.user,
		})
	} catch (error) {
		httpErrorHandler(ctx, error)
	}
})

/* Получить пользователя */
router.get('/:id', async ctx => {
	try {
		const user = await Users.getBy('id', {
			id: ctx.params.id,
			requestor: ctx.state.user,
		})

		if (user) {
			ctx.body = user
		} else {
			ctx.status = 404
			ctx.body = 'Пользователь не существует'
		}
	} catch (error) {
		httpErrorHandler(ctx, error)
	}
})

/* Создать пользователя */
router.post('/', async ctx => {
	try {
		ctx.body = await Users.create({
			user: ctx.request.body,
			requestor: ctx.state.user,
		})
	} catch (error) {
		httpErrorHandler(ctx, error)
	}
})

/* Обновить пароль, если уже авторизован */
router.put('/password', async ctx => {
	try {
		await Users.setPassword({
			...ctx.request.body,
			requestor: ctx.state.user,
		})

		ctx.status = 200
	} catch (error) {
		httpErrorHandler(ctx, error)
	}
})

/* Обновить пользователя */
router.put('/:id', async ctx => {
	try {
		const res = await Users.update({
			id: ctx.params.id,
			user: ctx.request.body,
			requestor: ctx.state.user,
		})

		ctx.status = res ? 200 : 404
	} catch (error) {
		httpErrorHandler(ctx, error)
	}
})

/* Удалить пользователя */
router.delete('/:id', async ctx => {
	try {
		const res = await Users.remove({
			id: ctx.params.id,
			requestor: ctx.state.user,
		})

		ctx.status = res ? 200 : 404
	} catch (error) {
		httpErrorHandler(ctx, error)
	}
})

export default router.routes()
