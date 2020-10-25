import DB from '../../core/DB'

class Users {
	/**
	* @summary Создание нового пользователя
	*/
	async create(user) {
		try {
			const exists = await this.getByEmail(user.email)
			if (exists) throw Error('Пользователь с таким email уже существует')

			const text = 'INSERT INTO users(email, firstName, lastName, password, phone) VALUES($1, $2, $3, $4, $5) RETURNING id'
			const values = [user.email, user.firstName, user.lastName, user.password, user.phone]
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
		const text = 'UPDATE users SET email=$1, firstName=$2, lastName=$3, phone=$4 WHERE id=$5'
		const values = [user.email, user.firstName, user.lastName, user.phone, id]
		return 1 === (await DB.query(text, values)).rowCount
	}

	/**
	* @summary Удаление пользователя
	*/
	async remove(id) {
		return 0 < (await DB.query('DELETE FROM users WHERE id=$1', [id])).rowCount
	}

	/**
	* @summary Запрос данных по пользователю (кроме пароля)
	*/
	async getById(id) {
		return (await DB.query('SELECT id, email, firstName, lastName, phone FROM users WHERE id=$1', [id])).rows[0]
	}

	/**
	* @summary Получение списка пользователей со всеми атрибутами (кроме пароля; применяются параметры фильтрации)
	*/
	async getList(filters = {
		limit: 20,
	}) {
		const { rows } = await DB.query('SELECT id, email, firstName, lastName, phone FROM users LIMIT $1', [
			filters.limit,
		])

		return rows
	}
}

export default Users
