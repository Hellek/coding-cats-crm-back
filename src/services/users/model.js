import DB from '../../core/DB'

import {
	generateHash,
	cryptrTokens,
} from '../utils/common'

class Users {
	/**
	* @summary Создание нового пользователя
	*/
	async create({
		user,
		requestor,
	}) {
		// Сейчас только isInitialUser
		if (requestor.id !== 1) throw Error(403)

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
	async update({
		id,
		user,
		requestor,
	}) {
		const isInitialUser = (requestor.id === 1)
		const isSelfRequest = (requestor.id === user.id)

		if (!isInitialUser && !isSelfRequest) throw Error(403)

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
	async directPasswordUpdate(id, password) {
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
	async remove({ id, requestor }) {
		// Только isInitialUser
		if (requestor.id !== 1) throw Error(403)

		return 0 < (await DB.query('DELETE FROM users WHERE id=$1', [id])).rowCount
	}

	/**
	* @summary Запрос данных по пользователю
	*/
	async getBy(by, {
		id = null,
		email = null,
		getPasswordHash = false,
		dangerouslyUnauthorizedGet = false,
		requestor = {},
	}) {
		const isInitialUser = (requestor.id === 1)
		const isSelfRequest = (requestor.id === +id)

		if (!isInitialUser && !isSelfRequest && !dangerouslyUnauthorizedGet) throw Error(403)

		// Проверка входного by
		if (!['id', 'email'].includes(by)) throw Error(`Поиск по ${by} отсутствует. Допустимо ["id", "email"]`)

		// Запрашивать ли пароль?
		const getPasswordQuery = getPasswordHash ? ', password' : ''

		const text = `SELECT id, active, email, "firstName", "lastName", "TIRealToken", "TISandboxToken", created, phone${getPasswordQuery} FROM users WHERE ${by}=$1`
		let values = null

		switch (by) {
		case 'id': values = [id]
			break
		case 'email': values = [email.toLowerCase().trim()]
			break
		default: values = []
			break
		}

		// Запрашиваем данные
		const { rows } = await DB.query(text, values)
		// Пользователь не найден
		if (rows.length === 0) return null
		// Ппроверяем работаем ли с одной сущностью
		if (rows.length > 1) throw Error('По запросу найдено несколько сущностей')

		const user = rows[0]

		if (isSelfRequest || dangerouslyUnauthorizedGet) {
			// Если есть токены ТИ, дешифруем
			if (user?.TIRealToken) user.TIRealToken = cryptrTokens.decrypt(user.TIRealToken)
			if (user?.TISandboxToken) user.TISandboxToken = cryptrTokens.decrypt(user.TISandboxToken)
		} else {
			delete user.TIRealToken
			delete user.TISandboxToken
		}

		return user
	}

	/**
	* @summary Получение списка пользователей
	*/
	async getList({
		filters,
		requestor,
	}) {
		const localFilters = {
			limit: 20,
			...filters,
		}

		if (requestor.id !== 1) throw Error(403)

		const { rows } = await DB.query('SELECT id, active, email, "firstName", "lastName", phone FROM users LIMIT $1', [
			localFilters.limit,
		])

		return rows
	}

	/**
	* @summary Обновление пароля если мы авторизованы
	*/
	async setPassword({ id, password, requestor }) {
		const user = await this.getBy('id', { id, requestor })
		const isInitialUser = (requestor.id === 1)
		const isSelfRequest = (requestor.id === user.id)

		if (!isInitialUser && !isSelfRequest) throw Error(403)

		await this.directPasswordUpdate(user.id, password)
	}

	/**
	* @summary Проверка существует ли пользователь
	*/
	async isExists(columnName, value) {
		if (!['id', 'email', 'phone'].includes(columnName)) throw Error(`Поиск по ${columnName} отсутствует. Допустимо ["id", "email", "phone"]`)
		return (await DB.query(`SELECT EXISTS(SELECT 1 from users WHERE ${columnName}=$1)`, [value])).rows[0].exists
	}
}

export default Users
