// import auth from './auth/http'
import external from './external/http'
// import ideas from './ideas/http'
// import instruments from './instruments/http'
// import users from './users/http'
// import roles from './roles/http'
// import tinkoffInvestments from './tinkoff-investments/http'

function setServiceRoutes(router) {
	// router.use('/auth', auth)
	router.use('/external', external)
	// router.use('/ideas', ideas)
	// router.use('/instruments', instruments)
	// router.use('/users', users)
	// router.use('/roles', roles)
	// router.use('/tinkoff-investments', tinkoffInvestments)
}

export default setServiceRoutes
