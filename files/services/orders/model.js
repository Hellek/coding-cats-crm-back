const Comments = new (require(`${Dirs.services}/comments/model.js`))
class Orders {
	async getList() {
		return await DB.query({
			dateStrings: true,
			sql: `SELECT id, status, registered, recall, responsible FROM orders`
		})
	}

	async getByID(id) {
		id = parseInt(id)

		if (isNaN(id)) {
			return {
				'id': null,
				'status': 1,
				'registered': null,
				'recall': null,
				'responsible': 1
			}
		} else {
			const user = (await DB.query({
				dateStrings: true,
				sql: `SELECT id, status, registered, recall, creator, responsible FROM orders WHERE id = ${id} LIMIT 1`
			}))[0]

			return user ? user : null
		}
	}

	async getStatuses() {
		return await DB.query(`SELECT id, name FROM orders_statuses`)
	}

	async create(userId, order) {
		return (await DB.query({
			namedPlaceholders: true,
			sql: `INSERT INTO orders (status, recall, creator, responsible) VALUES (:status, :recall, ${userId}, :responsible)`
		}, order)).insertId
	}

	async update(order) {
		return 1 === (await DB.query({
			namedPlaceholders: true,
			sql: 'UPDATE orders SET `status`=:status, `recall`=:recall, `responsible`=:responsible WHERE id=' + parseInt(order.id)
		}, order)).affectedRows
	}

	async getCommentsList(order_id) {
		return await Comments.getList({
			serviceName: 'orders',
			id: {
				name: 'order_id',
				value: order_id
			},
		})
	}

	async addComment(user_id, order_id, text) {
		return await Comments.add({
			serviceName: 'orders',
			id: {
				name: 'order_id',
				value: order_id
			},
			user_id,
			text
		})
	}
}

module.exports = Orders
