import DB from '../../core/DB'

class Development {
	/**
	* @summary Инициализация таблицы
	*/
	async tableCreate(tableName) {
		let sql = ''

		if (tableName === 'users') {
			sql = `CREATE TABLE users (
				id serial NOT NULL,
				active boolean NOT NULL DEFAULT FALSE,
				email character varying(50) UNIQUE,
				"firstName" character varying(50),
				"lastName" character varying(50),
				password character varying(80),
				phone character varying(11),
				PRIMARY KEY(id)
			);`
		} else {
			throw Error('SQL для данной таблицы не существует')
		}

		await DB.query(sql)
	}

	/**
	* @summary Удаление таблицы
	*/
	async tableDrop(tableName) {
		await DB.query(`DROP TABLE ${tableName}`)
	}
}

export default Development
