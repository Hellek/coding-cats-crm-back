import koaRouter from 'koa-router'
import UsersModel from './model'

const router = new koaRouter()
const Users = new UsersModel

/* Получить список пользователей */
router.get('/', async ctx => {
	try {
		ctx.body = await Users.getList()
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Получить пользователя */
router.get('/:id', async ctx => {
	try {
		const user = await Users.getBy('id', {
			id: ctx.params.id,
			isSelfRequest: ctx.params.id === ctx.state.user.id,
		})

		if (user) {
			ctx.body = user
		} else {
			ctx.status = 404
			ctx.body = 'Пользователь не существует'
		}
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Создать пользователя */
router.post('/', async ctx => {
	try {
		ctx.body = await Users.create(ctx.request.body)
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Обновить пароль, если уже авторизован */
router.put('/password', async ctx => {
	try {
		await Users.setPassword({ ...ctx.request.body, user: ctx.state.user})
		ctx.status = 200
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Обновить пользователя */
router.put('/:id', async ctx => {
	try {
		const res = await Users.update(ctx.params.id, ctx.request.body)
		ctx.status = res ? 200 : 404
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Удалить пользователя */
router.delete('/:id', async ctx => {
	try {
		const res = await Users.remove(ctx.params.id)
		ctx.status = res ? 200 : 404
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

export default router.routes()
