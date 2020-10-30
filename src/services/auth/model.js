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
		const user = await Users.getByEmail({ email, getPassword: true })
		console.log(user)
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
}

export default Auth
