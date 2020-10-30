import { generateHash } from '../utils/common'
import DB from '../../core/DB'

class Users {
	/**
	* @summary Создание нового пользователя
	*/
	async create(user) {
		try {
			const exists = await this.getByEmail(user)
			if (exists) throw Error('Пользователь с таким email уже существует')

			// Хэшируем пароль
			user.password = await generateHash(user.password)

			const text = 'INSERT INTO users(email, firstName, lastName, password, phone, active) VALUES($1, $2, $3, $4, $5, $6) RETURNING id'
			const values = [user.email, user.firstName, user.lastName, user.password, user.phone, user.active]
			const { rows } = await DB.query(text, values)
			return rows[0].id
		} catch (error) {
			throw error
		}
	}

	/**
	* @summary Обновление данных пользователя (кроме пароля)
	*/
	async update(id, user) {
		const text = 'UPDATE users SET email=$2, firstName=$3, lastName=$4, phone=$5, active=$6 WHERE id=$1'
		const values = [id, user.email, user.firstName, user.lastName, user.phone, user.active]
		return 1 === (await DB.query(text, values)).rowCount
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
	async getByEmail({ email, getPassword = false }) {
		const password = getPassword ? ', password' : ''
		return (await DB.query(`SELECT id, active, email, firstName, lastName, phone${password} FROM users WHERE email=$1`, [email])).rows[0]
	}

	/**
	* @summary Запрос данных по пользователю по id (кроме пароля)
	*/
	async getById(id) {
		return (await DB.query('SELECT id, active, email, firstName, lastName, phone FROM users WHERE id=$1', [id])).rows[0]
	}

	/**
	* @summary Получение списка пользователей со всеми атрибутами (кроме пароля; применяются параметры фильтрации)
	*/
	async getList(filters = {
		limit: 20,
	}) {
		const { rows } = await DB.query('SELECT id, active, email, firstName, lastName, phone FROM users LIMIT $1', [
			filters.limit,
		])

		return rows
	}
}

export default Users
