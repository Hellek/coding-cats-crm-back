// https://github.com/Marak/faker.js
const faker = require('faker')
faker.locale = 'ru'

export function getFakeUser() {
	return {
		email: faker.internet.email(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		password: faker.internet.password(),
		phone: faker.phone.phoneNumber('79#########'),
		role: 2,
		active: 0,
	}
}
