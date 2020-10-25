import auth from './auth/http'
import users from './users/http'

function setServiceRoutes(router) {
	if (global.ENV.HAS_AUTH_SERVICE) router.use('/auth', auth)
	router.use('/users', users)
}

export default setServiceRoutes
