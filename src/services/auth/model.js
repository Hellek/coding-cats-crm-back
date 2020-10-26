import { isEmailValid } from '../utils/common'
import UsersModel from '../users/model'

const Users = new UsersModel

class Auth {
	async authentication({ email, password }) {
		if (!email) throw Error('Не указан email')
		if (!password) throw Error('Не указан пароль')
		if (!await isEmailValid(email)) throw Error('Не валидный емейл, проверьте написание')
		const user = await Users.getByEmail({ email, getPassword: true })
		if (user == null) throw Error('Неверная пара логин-пароль')
		if (!user.active) throw Error('Доступ к системе запрещён')

		// Удаляем пароль и не нужные данные
		delete user.password
		delete user.active

		return user
	}
}

export default Auth
