import koaRouter from 'koa-router'
import IdeasModel from './model'

const router = new koaRouter()
const Ideas = new IdeasModel

/* Получить список идей */
router.get('/', async ctx => {
	try {
		ctx.body = await Ideas.getList({ user: ctx.state.user })
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Получить идею */
router.get('/:id', async ctx => {
	try {
		const idea = await Ideas.getById(ctx.params.id, ctx.state.user)

		if (idea) {
			ctx.body = idea
		} else {
			ctx.status = 404
			ctx.body = 'Идея не существует'
		}
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Создать идею */
router.post('/', async ctx => {
	try {
		ctx.body = await Ideas.create(ctx.request.body, ctx.state.user)
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Добавить комментарий */
router.post('/:id/comment', async ctx => {
	try {
		ctx.body = await Ideas.addComment({
			ideaId: ctx.params.id,
			user: ctx.state.user,
			comment: ctx.request.rawBody,
		})
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Завершить идею */
router.post('/:id/close', async ctx => {
	try {
		const res = await Ideas.close(ctx.params.id, ctx.state.user)
		ctx.status = res ? 200 : 404
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

/* Удалить идею */
router.delete('/:id', async ctx => {
	try {
		const res = await Ideas.remove(ctx.params.id, ctx.state.user)
		ctx.status = res ? 200 : 404
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

export default router.routes()
