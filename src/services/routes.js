import auth from './auth/http'
import ideas from './ideas/http'
import instruments from './instruments/http'
import users from './users/http'
import roles from './roles/http'
import development from './development/http'

function setServiceRoutes(router) {
	if (process.env.HAS_AUTH_SERVICE === 'true') router.use('/auth', auth)
	router.use('/ideas', ideas)
	router.use('/instruments', instruments)
	router.use('/users', users)
	router.use('/roles', roles)
	if (process.env.ENV === 'development') router.use('/development', development)
}

export default setServiceRoutes
