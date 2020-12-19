import { isEmailValid, compareHash } from '../utils/common'
import UsersModel from '../users/model'
import EmailModel from '../email/model'

const Users = new UsersModel
const Email = new EmailModel

class Auth {
	async validateAuthData({ email, password }) {
		if (!email) throw Error('Не указан email')
		if (!password) throw Error('Не указан пароль')
		if (!await isEmailValid(email)) throw Error('Не валидный емейл, проверьте написание')
	}

	async getValidUser({ email, password }) {
		await this.validateAuthData({ email, password })
		const user = await Users.getByEmail({ email, getPasswordHash: true })
		if (user != null && !user.active) throw Error('Доступ к системе запрещён')
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

	async setPassword({ email, password, hash }, ctx) {
		const user = await this.getValidUser({ email, password })

		// Если не залогинен, то проверяем правильно ли прислали хеш
		if (!ctx.session.authorized && (hash !== user.password)) throw Error('Хеш пароля устарел. Запросите сброс пароля заново')

		const isSuperAdmin = (ctx.session.user.id === 1)
		const isSelfUpdate = (ctx.session.user.id === user.id)

		if (isSuperAdmin || isSelfUpdate) {
			await Users.updatePassword(user.id, password)
		} else {
			throw Error('Недостаточно прав')
		}
	}

	async resetPassword({ email }) {
		const user = await this.getValidUser({ email, password: 'mock password' })
		const frontendUrl = JSON.parse(process.env.URLS).frontend

		if (user == null) return

		let html = 'Поступил запрос на смену пароля. Если он поступил от вас, то перейдите по <a href="'
		html += `${frontendUrl}/?set-new-password=true&hash=${user.password}&email=${email}`
		html += '">этой ссылке</a> для ввода нового пароля'

		await Email.send({
			to: email,
			subject: 'Запрос на смену пароля',
			html,
		})
	}
}

export default Auth
