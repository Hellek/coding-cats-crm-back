import koaRouter from 'koa-router'
import DevelopmentModel from './model'

const router = new koaRouter()
const Development = new DevelopmentModel

/* Создать таблицу */
router.post('/table/:tableName', async ctx => {
	try {
		ctx.body = await Development.tableCreate(ctx.params.tableName)
	} catch (error) {
		if (error.code === '42P07') ctx.throw(400, `Таблица ${ctx.params.tableName} уже существует`)
		ctx.throw(400, `Не удалось создать таблицу ${ctx.params.tableName}`)
	}
})

/* Установить значения по умолчанию */
router.put('/table/:tableName', async ctx => {
	try {
		await Development.setDefaults(ctx.params.tableName)
		ctx.body = `Таблица ${ctx.params.tableName} успешно обновлена`
	} catch (error) {
		console.log(error)
		ctx.throw(400, error)
	}
})

/* Удалить таблицу */
router.delete('/table/:tableName', async ctx => {
	try {
		ctx.body = await Development.tableDrop(ctx.params.tableName)
	} catch (error) {
		console.log(error)
		if (error.code === '42P01') ctx.throw(400, `Таблицы ${ctx.params.tableName} не существует`)
		ctx.throw(400, `Не удалось удалить таблицу ${ctx.params.tableName}`)
	}
})

export default router.routes()
