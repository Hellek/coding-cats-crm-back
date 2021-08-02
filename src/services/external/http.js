import koaRouter from 'koa-router'
import EmailModel from '../email/model'

const router = new koaRouter()
const Email = new EmailModel

router.post('/email', async ctx => {
	let { text } = ctx.request.body
	const { origin } = ctx.request.headers

	if (!JSON.parse(process.env.ALLOWED_ORIGINS).includes(origin)) throw Error('Доступ запрещен')

	if (!text) throw Error('Не указано свойство text')

	text = text.trim().slice(0, 250)

	try {
		await Email.send({
			to: 'sashabasharina@yandex.ru',
			subject: `Запрос с ${origin.split('//')[1]}`,
			html: text,
		})

		ctx.status = 200
	} catch (error) {
		console.log(error);
		ctx.throw(400, 'Ошибка отправки сообщения')
	}
})

export default router.routes()
