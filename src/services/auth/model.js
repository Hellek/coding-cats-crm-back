import jsonwebtoken from 'jsonwebtoken'
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

	async getValidUser({ email, password, getPasswordHash = false }) {
		await this.validateAuthData({ email, password })
		const user = await Users.getByEmail({ email, getPasswordHash })
		if (user != null && !user.active) throw Error('Доступ к системе запрещён')
		return user
	}

	async authentication({ email, password }) {
		const user = await this.getValidUser({ email, password, getPasswordHash: true })
		if (user == null || !await compareHash(password, user.password)) throw Error('Неверная пара логин-пароль')
		return user
	}

	async setPassword({ email, password, hash }) {
		const user = await this.getValidUser({ email, password, getPasswordHash: true })

		if (hash === user.password) await Users.updatePassword(user.id, password)

		throw Error('Хеш пароля устарел. Запросите сброс пароля заново')
	}

	async getValidUserWithPasswordMock({ email, getPasswordHash = false }) {
		return await this.getValidUser({ email, getPasswordHash, password: 'password mock' })
	}

	async resetPassword({ email }) {
		const user = await this.getValidUserWithPasswordMock({ email, getPasswordHash: true })
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

	getJwtToken({ user }) {
		return new Promise((resolve, reject) => {
			jsonwebtoken.sign(user, JSON.parse(process.env.SECRET_KEYS).jwt, {
					algorithm: 'HS512',
					expiresIn: '48h',
				},
				function (error, token) {
					if (error) reject(error)
					else resolve(token)
				}
			)
		})
	}
}

export default Auth
