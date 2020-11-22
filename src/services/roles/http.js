import koaRouter from 'koa-router'
import RolesModel from './model'

const router = new koaRouter()
const Roles = new RolesModel

/* Получить список ролей */
router.get('/', async ctx => {
	try {
		ctx.body = await Roles.getList()
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Создать роль */
router.post('/', async ctx => {
	try {
		ctx.body = await Roles.create(ctx.request.body)
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Обновить роль */
router.put('/:id', async ctx => {
	try {
		const res = await Roles.update(ctx.params.id, ctx.request.body)
		ctx.status = res ? 200 : 404
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

export default router.routes()
