import auth from './auth/http'
import users from './users/http'
import development from './development/http'

function setServiceRoutes(router) {
	if (global.ENV.HAS_AUTH_SERVICE) router.use('/auth', auth)
	router.use('/users', users)
	if (global.ENV.ENV === 'development') router.use('/development', development)
}

export default setServiceRoutes
