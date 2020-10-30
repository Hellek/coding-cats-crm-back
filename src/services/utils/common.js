import isemail from 'isemail'
import bcryptjs from 'bcryptjs'

export async function compareHash(stringToCompare, hash) {
	return bcryptjs.compare(stringToCompare, hash)
}

export async function generateHash(stringToHashing, saltRounds = 5) {
	return bcryptjs.hash(stringToHashing, saltRounds)
}

export async function isEmailValid(email) {
	return isemail.validate(email)
}
