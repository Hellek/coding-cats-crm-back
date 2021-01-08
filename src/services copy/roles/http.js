const router = new (require('koa-router'))
import RolesModel from './model.js'
const Roles = new RolesModel

router.get('/list', async ctx => {
	ctx.body = await Roles.getList()
})

router.get('/rights-schema', async ctx => {
	ctx.body = await Roles.getRightsSchema()
})

/* router.get('/:id', async ctx => {
	const role = await Roles.getByID(ctx.params.id)

	if (role === null) {
		ctx.throw(404, 'Роль не существует')
	} else {
		ctx.body = role
	}
}) */

router.post('/', async ctx => {
	try {
		ctx.body = await Roles.create(ctx.request.body)
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.put('/', async ctx => {
	try {
		await Roles.update(ctx.request.body)
		ctx.status = 200
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

router.delete('/:id', async ctx => {
	try {
		await Roles.remove(ctx.params.id)
		ctx.status = 200
	} catch (error) {
		ctx.throw(400, error.message)
	}
})

module.exports = router.routes()
