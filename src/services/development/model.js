import DB from '../../core/DB'

class Development {
	/**
	* @summary Инициализация таблицы
	*/
	async tableCreate(tableName) {
		let sql = ''
		let message = null

		if (tableName === 'users') {
			sql = `CREATE TABLE users (
				id serial NOT NULL,
				active boolean NOT NULL DEFAULT FALSE,
				email character varying(50) UNIQUE,
				"firstName" character varying(50),
				"lastName" character varying(50),
				password character varying(80),
				phone character varying(11),
				"TIRealToken" character varying(800),
				"TISandboxToken" character varying(800),
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
		} else if (tableName === 'instruments') {
			sql = `CREATE TABLE instruments (
				ticker character varying(30) NOT NULL,
				UNIQUE(ticker)
			);`
		} else if (tableName === 'ideas') {
			const tableIdeas = `CREATE TABLE ideas (
				id serial NOT NULL,
				userId integer NOT NULL,
				ticker character varying(20) NOT NULL,
				active boolean NOT NULL DEFAULT TRUE,
 				created timestamp with time zone DEFAULT now(),
				FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
				PRIMARY KEY(id)
			);`

			const tableIdeasComments = `CREATE TABLE ideasComments (
				id serial NOT NULL,
				ideaId integer NOT NULL,
				text character varying(5000) NOT NULL,
				posted timestamp with time zone DEFAULT now(),
				FOREIGN KEY (ideaId) REFERENCES ideas (id) ON DELETE CASCADE,
				PRIMARY KEY(id)
			);`

			sql = `${tableIdeas};${tableIdeasComments}`
			message = 'Таблицы ideas, ideasComments успешно созданы'
		} else {
			throw Error('SQL для данной таблицы не существует')
		}

		await DB.query(sql)

		return message || `Таблица ${tableName} успешно создана`
	}

	/**
	* @summary Удаление таблицы
	*/
	async tableDrop(tableName) {
		let message = null

		if (tableName === 'ideas') {
			await DB.query(`DROP TABLE ideasComments, ideas`)
			message = 'Таблицы ideas, ideasComments успешно удалены'
		} else {
			await DB.query(`DROP TABLE ${tableName}`)
		}

		return message || `Таблица ${tableName} успешно удалена`
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
