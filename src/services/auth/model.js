import { isEmailValid, compareHash } from '../utils/common'
import UsersModel from '../users/model'

const Users = new UsersModel

class Auth {
	async validateAuthData({ email, password }) {
		if (!email) throw Error('Не указан email')
		if (!password) throw Error('Не указан пароль')
		if (!await isEmailValid(email)) throw Error('Не валидный емейл, проверьте написание')
	}

	async getValidUser({ email, password }) {
		await this.validateAuthData({ email, password })
		const user = await Users.getByEmail({ email, getPasswordHash: true })
		if (!user.active) throw Error('Доступ к системе запрещён')
		return user
	}

	async authentication({ email, password }) {
		const user = await this.getValidUser({ email, password })
		if (user == null || !await compareHash(password, user.password)) throw Error('Неверная пара логин-пароль')

		// Удаляем пароль и не нужные данные
		delete user.password
		delete user.active

		return user
	}

	async setPassword({ email, password, hash }) {
		const user = await this.getValidUser({ email, password })

		if (hash !== user.password) throw Error('Хеш пароля устарел. Запросите сброс пароля заново')

		await Users.updatePassword(user.id, password)
	}

	async reset({ email }) {
		const user = await this.getValidUser({ email, password: 'mock password' })

		// const frontServerUrl = `${Env.domains.front.protocol}://${Env.domains.front.domain}` + (Env.domains.front.port ? `:${Env.domains.front.port}` : '')

		/* const res = await Emails.sendEmail({
			to: ctx.request.body.email,
			subject: 'Запрос на смену пароля',
			html: 'Поступил запрос на смену пароля. Если запрос поступил от вас, то перейдите по <a href="'
				+ `${frontServerUrl}/auth/setnewpass?hash=${user.password}&email=${ctx.request.body.email}`
				+ '">этой ссылке</a> для ввода нового пароля'
		})

		if (res) {
			ctx.status = 200
		} else {
			ctx.throw(400, 'Не получилось отправить письмо на почту')
		} */
	}
}

export default Auth
