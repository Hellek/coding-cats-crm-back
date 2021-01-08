import { promisify } from 'util'
import { resolve as resolvePath, basename as pathBasename } from 'path'
import { readFile, existsSync as fileExistsSync } from 'fs'
import { getSubDirectoriesPathList } from '../utils/common'
import {
	throw_ER_DUP_ENTRY,
	throw_ER_ROW_IS_REFERENCED_2,
} from './model.errors'
const readFileAsync = promisify(readFile)
const DB = require('../../core/db-connection')

class Roles {
	/**
	* @summary Создание роли
	*/
	async create(role) {
		try {
			return (await DB.query('INSERT INTO roles (`label`, `rights`) VALUES (:label, :rights)', role)).insertId
		} catch (error) {
			throw_ER_DUP_ENTRY(error)
			throw error
		}
	}

	/**
	* @summary Обновление названия и прав доступа (не стандартной) роли
	*/
	async update(role) {
		// Нельзя менять права доступа и название для стандартных ролей
		if (role.id === 1 || role.id === 2) {
			role.label = role.id === 1 ? 'Суперадмин' : 'Бесправный'

			Object.keys(role.rights).forEach(serviceName => {
				Object.keys(role.rights[serviceName]).forEach(methodName => {
					role.rights[serviceName][methodName] = role.id === 1 ? true : false
				})
			})
		}

		try {
			return 1 === (await DB.query('UPDATE roles SET `label`=:label, `rights`=:rights WHERE id=:id', role)).affectedRows
		} catch (error) {
			throw_ER_DUP_ENTRY(error)
			throw error
		}
	}

	/**
	* @summary Удаление роли
	*/
	async remove(id) {
		try {
			return 1 === (await DB.query('DELETE FROM roles WHERE id=:id', { id })).affectedRows
		} catch (error) {
			throw_ER_ROW_IS_REFERENCED_2(error)
			throw error
		}
	}

	/**
	* @summary Получение списка ролей с данными
	*/
	async getList() {
		const roles = await DB.cats.query('SELECT id, label, rights FROM roles')

		roles.forEach(role => {
			role.rights = JSON.parse(role.rights)
		})

		return roles
	}

	/**
	* @summary Получение схемы всех методов учавствующих в правах доступа
	*/
	async getRightsSchema() {
		const servicesPathList = await getSubDirectoriesPathList(resolvePath('./services'))
		const servicesWithModelPathList = servicesPathList.filter(servicePath => fileExistsSync(servicePath + '/model.js'))
		let rightsSchema = {}

		const servicesArray = servicesWithModelPathList.map(async httpServiceDir => {
			const service = {}
			const serviceName = pathBasename(httpServiceDir)
			service[serviceName] = {}

			const readResult = await readFileAsync(`${httpServiceDir}/model.js`, 'utf-8')
			const matchResult = readResult.matchAll(/@summary (.*)\s.*\s.*async (\w*)/g)
			const matchResultsAsArray = Array.from(matchResult)

			matchResultsAsArray.forEach(match => {
				const methodDescription = match[1]
				const methodName = match[2]

				service[serviceName][methodName] = {
					desc: methodDescription,
				}
			})

			return service
		})

		const resolvedServicesArray = await Promise.all(servicesArray)

		resolvedServicesArray.forEach(service => {
			Object.assign(rightsSchema, service)
		})

		return rightsSchema
	}
}

export default Roles
