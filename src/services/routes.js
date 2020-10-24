import users from './users/http'

function setServiceRoutes(router) {
	router.use('/users', users)
}

export default setServiceRoutes
