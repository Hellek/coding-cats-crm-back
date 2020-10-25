import isemail from 'isemail'

export async function isEmailValid(email) {
	return isemail.validate(email)
}
