import auth from './auth/http'
import users from './users/http'
import development from './development/http'

function setServiceRoutes(router) {
	if (process.env.HAS_AUTH_SERVICE === 'true') router.use('/auth', auth)
	router.use('/users', users)
	if (process.env.ENV === 'development') router.use('/development', development)
}

export default setServiceRoutes
