import jsonwebtoken from 'jsonwebtoken'
import { isEmailValid, compareHash } from '../utils/common'
import UsersModel from '../users/model'
import EmailModel from '../email/model'

const Users = new UsersModel
const Email = new EmailModel

class Auth {
	async validateAuthData({ email, password, isPasswordRequired = true }) {
		if (!email) throw Error('Не указан email')
		if (isPasswordRequired && !password) throw Error('Не указан пароль')
		if (!await isEmailValid(email)) throw Error('Не валидный емейл, проверьте написание')
	}

	async getValidUser({
		email,
		password,
		getPasswordHash = false,
		isPasswordRequired = true,
		dangerouslyUnauthorizedGet = false,
	}) {
		await this.validateAuthData({ email, password, isPasswordRequired })
		const user = await Users.getBy('email', { email, getPasswordHash, dangerouslyUnauthorizedGet })
		if (!user || !user.active) throw Error('Доступ к системе запрещён')
		return user
	}

	async authentication({ email, password }) {
		const user = await this.getValidUser({ email, password, getPasswordHash: true, dangerouslyUnauthorizedGet: true })
		if (!user || !await compareHash(password, user.password)) throw Error('Неверная пара логин-пароль')

		delete user.password

		return user
	}

	async setPassword({ email, password, hash }) {
		const user = await this.getValidUser({ email, password, getPasswordHash: true, dangerouslyUnauthorizedGet: true })

		if (hash !== user.password) throw Error('Хеш пароля устарел. Запросите сброс пароля заново')

		await Users.directPasswordUpdate(user.id, password)
	}

	async getValidUserWithoutPassword({ email, getPasswordHash = false, dangerouslyUnauthorizedGet = false }) {
		return await this.getValidUser({ email, getPasswordHash, isPasswordRequired: false, dangerouslyUnauthorizedGet })
	}

	async resetPassword({ email }) {
		const user = await this.getValidUserWithoutPassword({ email, getPasswordHash: true, dangerouslyUnauthorizedGet: true })
		const frontendUrl = JSON.parse(process.env.URLS).frontend

		if (!user) return

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
			})
		})
	}
}

export default Auth
