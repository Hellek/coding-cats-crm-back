import DB from '../../core/DB'

class Instruments {
	/**
	* @summary Получение инструментов по фильтру
	*/
	async getList({ queryString = '' }) {
		const likeTemplate = `%${queryString.trim().toUpperCase()}%`

		return (await DB.query("SELECT ticker FROM instruments WHERE ticker LIKE $1", [likeTemplate])).rows
	}
}

export default Instruments
