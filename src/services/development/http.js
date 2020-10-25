import koaRouter from 'koa-router'
import DevelopmentModel from './model'

const router = new koaRouter()
const Development = new DevelopmentModel

/* Создать таблицу */
router.post('/table/:tableName', async ctx => {
	try {
		await Development.tableCreate(ctx.params.tableName)
		ctx.body = `Таблица ${ctx.params.tableName} успешно создана`
	} catch (error) {
		if (error.code === '42P07') ctx.throw(400, `Таблица ${ctx.params.tableName} уже существует`)
		ctx.throw(400, `Не удалось создать таблицу ${ctx.params.tableName}`)
	}
})

/* Удалить таблицу */
router.delete('/table/:tableName', async ctx => {
	try {
		await Development.tableDrop(ctx.params.tableName)
		ctx.body = `Таблица ${ctx.params.tableName} успешно удалена`
	} catch (error) {
		console.log(error)
		if (error.code === '42P01') ctx.throw(400, `Таблицы ${ctx.params.tableName} не существует`)
		ctx.throw(400, `Не удалось удалить таблицу ${ctx.params.tableName}`)
	}
})

export default router.routes()
