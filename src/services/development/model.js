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
				phone character varying(11)
				PRIMARY KEY(id)
			);`
		} else if (tableName === 'roles') {
			sql = `CREATE TABLE roles (
				id serial NOT NULL,
				label character varying(100) NOT NULL,
				rights json NOT NULL,
				PRIMARY KEY(id),
				UNIQUE(label)
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

	/**
	* @summary Подстановка в таблицы значений по умолчанию
	*/
	async setDefaults(tableName) {
		if (tableName === 'roles') {
			const sql = `INSERT INTO  roles (label, rights) VALUES ('Суперадмин', '{}'), ('Бесправный', '{}');`
			await DB.query(sql)
		} else {
			throw Error('SQL для данной таблицы не существует')
		}
	}
}

export default Development
