import DB from '../../core/DB'

class Ideas {
	/**
	* @summary Создание новой идеи
	*/
	async create(idea, user) {
		try {
			const text = 'INSERT INTO ideas (figi, userId) VALUES ($1, $2) RETURNING *'
			const values = [idea.figi, user.id]
			const { rows } = await DB.query(text, values)

			return { ...rows[0], comments: [] }
		} catch (error) {
			console.log(error)
			throw Error('Ошибка создания идеи')
		}
	}

	/**
	* @summary Добавление комментария
	*/
	async addComment({ideaId, user, comment}) {
		if (!comment.trim().length) throw Error('comment не может быть пустым')

		try {
			if (!await this.isIdeaExists(ideaId, user)) throw Error('Идея не найдена')

			const text = 'INSERT INTO ideasComments (ideaId, text) VALUES ($1, $2) RETURNING *'
			const values = [ideaId, comment]
			return (await DB.query(text, values)).rows[0]
		} catch (error) {
			console.log(error)
			throw Error('Ошибка добавления комментария')
		}
	}

	/**
	* @summary Завершить идею
	*/
	async close(id, user) {
		const text = 'UPDATE ideas SET active=false WHERE id=$1 AND userId=$2'
		const values = [id, user.id]

		try {
			return 0 < (await DB.query(text, values)).rowCount
		} catch (error) {
			console.log(error)
			throw Error('Ошибка при завершении')
		}
	}

	/**
	* @summary Удаление идеи
	*/
	async remove(id, user) {
		return 0 < (await DB.query('DELETE FROM ideas WHERE id=$1 AND userId=$2', [id, user.id])).rowCount
	}

	/**
	* @summary Проверка существует ли идея
	*/
	async isIdeaExists(id, user) {
		return (await DB.query('SELECT EXISTS(SELECT 1 from ideas WHERE id=$1 AND userId=$2)', [id, user.id])).rows[0].exists
	}

	/**
	* @summary Запрос идеи по id, для текущего пользователя
	*/
	async getById(id, user) {
		const idea = (await DB.query('SELECT * FROM ideas WHERE id=$1 AND userId=$2', [id, user.id])).rows[0]

		if (!idea) throw Error('Идея не найдена')

		const comments = (await DB.query('SELECT * FROM ideasComments WHERE ideaId=$1', [idea.id])).rows || []

		return { ...idea, comments }
	}

	/**
	* @summary Получение списка идей
	*/
	async getList({
		limit = 2000,
		user,
	}) {
		const { rows } = await DB.query('SELECT id, figi, active, created FROM ideas WHERE userId=$1 LIMIT $2', [
			user.id,
			limit,
		])

		return rows
	}
}

export default Ideas
