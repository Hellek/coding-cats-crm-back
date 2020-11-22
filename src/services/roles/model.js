import DB from '../../core/DB'

class Roles {
	/**
	* @summary Создание роли
	*/
	async create(role) {
		const text = 'INSERT INTO roles (label, rights) VALUES ($1, $2) RETURNING id'
		const values = [role.label, role.rights]
		const { rows } = await DB.query(text, values)

		return rows[0].id
	}

	/**
	* @summary Обновление названия и прав доступа (не стандартной) роли
	*/
	async update(id, user) {
		const text = 'UPDATE roles SET label=$2, rights=$3 WHERE id=$1'
		const values = [id, user.label, user.rights]
		return 1 === (await DB.query(text, values)).rowCount
	}

	/**
	* @summary Получение списка ролей
	*/
	async getList() {
		const { rows } = await DB.query('SELECT id, label, rights FROM roles')

		return rows
	}
}

export default Roles
