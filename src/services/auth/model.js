import { isEmailValid } from '../utils/common'

class Auth {
	async authentication({ email, password }) {
		if (!email) throw Error('Не указан email')
		if (!password) throw Error('Не указан пароль')
		if (!await isEmailValid(email)) throw Error('Не валидный емейл, проверьте написание')
		const user = { email, active: true }
		if (!user.active) throw Error('Доступ к системе запрещён')

		// Удаляем пароль и не нужные данные
		delete user.active

		return user
	}
}

export default Auth
