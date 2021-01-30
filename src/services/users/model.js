import DB from '../../core/DB'

import {
	generateHash,
	cryptrTokens,
} from '../utils/common'

class Users {
	/**
	* @summary Создание нового пользователя
	*/
	async create(user) {
		user.email = user.email.toLowerCase().trim()

		const exists = await this.isExists('email', user.email)
		if (exists) throw Error('Пользователь с таким email уже существует')

		const passwordHash = await generateHash(user.password)
		const text = 'INSERT INTO users (email, "firstName", "lastName", password, phone, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
		const values = [user.email, user.firstName.trim(), user.lastName.trim(), passwordHash, user.phone, user.active]
		const { rows } = await DB.query(text, values)

		return rows[0]
	}

	/**
	* @summary Обновление данных пользователя (кроме пароля)
	*/
	async update(id, user) {
		const text = 'UPDATE users SET email=$2, "firstName"=$3, "lastName"=$4, phone=$5, active=$6, "TIRealToken"=$7, "TISandboxToken"=$8 WHERE id=$1'

		// Если есть токены ТИ, шифруем
		if (user.TIRealToken) user.TIRealToken = cryptrTokens.encrypt(user.TIRealToken)
		if (user.TISandboxToken) user.TISandboxToken = cryptrTokens.encrypt(user.TISandboxToken)

		const values = [id, user.email.toLowerCase().trim(), user.firstName.trim(), user.lastName.trim(), user.phone, user.active, user.TIRealToken, user.TISandboxToken]
		return 1 === (await DB.query(text, values)).rowCount
	}

	/**
	* @summary Сырое sql-обновление пароля пользователя без валидации
	*/
	async updatePassword(id, password) {
		const passwordHash = await generateHash(password)
		const text = 'UPDATE users SET password=$2 WHERE id=$1'
		const values = [id, passwordHash]

		try {
			await DB.query(text, values)
		} catch (error) {
			console.log(error)
			throw Error('Ошибка обновления пароля')
		}
	}

	/**
	* @summary Удаление пользователя
	*/
	async remove(id) {
		return 0 < (await DB.query('DELETE FROM users WHERE id=$1', [id])).rowCount
	}

	/**
	* @summary Запрос данных по пользователю по email (кроме пароля)
	*/
	async getByEmail({ email, getPasswordHash = false }) {
		const password = getPasswordHash ? ', password' : ''
		const user = (await DB.query(`SELECT id, active, email, "firstName", "lastName", "TIRealToken", "TISandboxToken", created, phone${password} FROM users WHERE email=$1`, [email.toLowerCase().trim()])).rows[0]

		// Если есть токены ТИ, дешифруем
		if (user?.TIRealToken) user.TIRealToken = cryptrTokens.decrypt(user.TIRealToken)
		if (user?.TISandboxToken) user.TISandboxToken = cryptrTokens.decrypt(user.TISandboxToken)

		return user
	}

	/**
	* @summary Запрос данных по пользователю по id (кроме пароля)
	*/
	async getById({ id, ctx }) {
		const user = (await DB.query('SELECT id, active, email, "firstName", "lastName", "TIRealToken", "TISandboxToken", created, phone FROM users WHERE id=$1', [id])).rows[0]

		if (ctx.state.user.id !== id) {
			user.TIRealToken = null
			user.TISandboxToken = null
		}

		// Если есть токены ТИ, дешифруем
		if (user?.TIRealToken) user.TIRealToken = cryptrTokens.decrypt(user.TIRealToken)
		if (user?.TISandboxToken) user.TISandboxToken = cryptrTokens.decrypt(user.TISandboxToken)

		return user
	}

	/**
	* @summary Получение списка пользователей со всеми атрибутами (кроме пароля; применяются параметры фильтрации)
	*/
	async getList(filters = {
		limit: 20,
	}) {
		const { rows } = await DB.query('SELECT id, active, email, "firstName", "lastName", phone FROM users LIMIT $1', [
			filters.limit,
		])

		return rows
	}

	/**
	* @summary Обновление пароля если мы авторизованы
	*/
	async setPassword({ email, password, user }) {
		const userUpdateCandidate = await this.getByEmail({ email })
		const isRequestorInitialUser = (user.id === 1)
		const isRequestorSelfUpdate = (user.id === userUpdateCandidate.id)

		if (isRequestorInitialUser || isRequestorSelfUpdate) {
			await this.updatePassword(userUpdateCandidate.id, password)
		} else {
			throw Error('Недостаточно прав')
		}
	}

	/**
	* @summary Проверка существует ли пользователь
	*/
	async isExists(columnName, value) {
		return (await DB.query(`SELECT EXISTS(SELECT 1 from users WHERE ${columnName}=$1)`, [value])).rows[0].exists
	}
}

export default Users
