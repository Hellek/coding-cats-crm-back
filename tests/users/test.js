import UsersModel from '../../services/users/model'
import { getFakeUser } from '../faker'
// import { compareHash } from '../../services/utils/common'
import dayjs from '../../core/dayjs'

const Users = new UsersModel
const firstUserData = getFakeUser()
const anotherUserData = getFakeUser()
let createdUserId = null

test('Users.create() and Users.getById()', async () => {
	createdUserId = await Users.create(firstUserData)
	const createdUser = await Users.getById(createdUserId)

	Object.keys(firstUserData).forEach(async prop => {
		if (prop === 'password') {
			// getById не возвращает пароль
			// const compareResult = await compareHash(firstUserData.password, createdUser.password)
			// expect(compareResult).toBe(true)
		} else if (prop === 'registered') {
			const expected = dayjs(createdUser[prop]).startOf('minute').toISOString()
			const mustBe = dayjs().startOf('minute').toISOString()
			expect(expected).toBe(mustBe)
		} else {
			expect(createdUser[prop]).toBe(firstUserData[prop])
		}
	})
})

test('Users.update()', async () => {
	Object.assign(anotherUserData, {
		id: createdUserId,
	})

	const isUpdated = await Users.update(anotherUserData)
	expect(isUpdated).toBe(true)
})

test('Users.remove()', async () => {
	let isRemoved = await Users.remove(createdUserId)
	expect(isRemoved).toBe(true)
})

test('Users.getList()', async () => {
	const limit = 2
	const users = await Users.getList({
		limit,
	})

	expect(Array.isArray(users)).toBe(true)
	expect(users.length).toBe(limit)
	expect(typeof users[0].id).toBe('number')
	expect(typeof users[0].email).toBe('string')
})