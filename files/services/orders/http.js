const router = new (require('koa-router'))
/* const Orders = new (require(`${Dirs.services}/orders/model.js`))

router.get('/list', async ctx => {
	ctx.body = await Orders.getList()
})

router.get('/statuses', async ctx => {
	ctx.body = await Orders.getStatuses()
})

router.get('/:id?', async ctx => {
	const order = await Orders.getByID(ctx.params.id)

	if (order === null) {
		ctx.throw(404, 'Заказ не существует')
	} else {
		ctx.body = order
	}
})

router.post('/', async ctx => {
	ctx.body = await Orders.create(ctx.session.user.id, ctx.request.body)
})

router.put('/', async ctx => {
	if (await Orders.update(ctx.request.body)) {
		ctx.status = 200
	} else {
		ctx.throw(400)
	}
})

////////// Comments
router.get('/comments/list', async ctx => {
	ctx.body = await Orders.getCommentsList(ctx.query.id)
})

router.post('/comments/', async ctx => {
	ctx.body = await Orders.addComment(ctx.session.user.id, ctx.request.body.id, ctx.request.body.text)
}) */

module.exports = router.routes()
