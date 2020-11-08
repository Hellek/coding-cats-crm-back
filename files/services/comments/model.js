class Comments {
	constructor() {
		this.requiredFiledsText = 'Отсутствуют обязательные поля'
	}

	async add(comment) {
		comment.id.value = parseInt(comment.id.value)
		comment.user_id = parseInt(comment.user_id)
		comment.text = String(comment.text).trim()
		comment.serviceName = String(comment.serviceName).trim()

		if (
			!isNaN(comment.id.value) &&
			!isNaN(comment.user_id) &&
			comment.text !== '' &&
			comment.serviceName !== ''
		) {
			return 1 === (await DB.query(`INSERT INTO ${comment.serviceName}_comments (${comment.id.name}, user_id, text) VALUES (${comment.id.value}, ${comment.user_id}, '${comment.text}')`)).affectedRows
		} else {
			throw this.requiredFiledsText
		}
	}

	async getList(comment) {
		comment.id.value = parseInt(comment.id.value)
		comment.id.name = String(comment.id.name).trim()
		comment.serviceName = String(comment.serviceName).trim()

		if (
			comment.id.name !== '' &&
			comment.serviceName !== ''
		) {
			if (isNaN(comment.id.value)) { return [] }

			return await DB.query({
				dateStrings: true,
				sql: `SELECT time, user_id, text FROM ${comment.serviceName}_comments WHERE ${comment.id.name}=${comment.id.value}`
			})
		} else {
			throw this.requiredFiledsText
		}
	}
}

module.exports = Comments
