import { join as pathJoin } from 'path'
import { readdirSync, lstatSync } from 'fs'
import isemail from 'isemail'
import bcryptjs from 'bcryptjs'

export async function getSubDirectoriesPathList(directoryPath) {
	return readdirSync(directoryPath).map(name => pathJoin(directoryPath, name)).filter(directoryPath => lstatSync(directoryPath).isDirectory())
}

export function getSubDirectoriesPathListSync(directoryPath) {
	return readdirSync(directoryPath).map(name => pathJoin(directoryPath, name)).filter(directoryPath => lstatSync(directoryPath).isDirectory())
}

export async function compareHash(stringToCompare, hash) {
	return bcryptjs.compare(stringToCompare, hash)
}

export async function generateHash(stringToHashing, saltRounds = 5) {
	return bcryptjs.hash(stringToHashing, saltRounds)
}

export async function isEmailValid(email) {
	return isemail.validate(email)
}
