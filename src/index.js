import './core/ENV'
import koa from 'koa'
import http from 'http'
import koaHelmet from 'koa-helmet'
import koaCors from '@koa/cors'
import koaBodyparser from 'koa-bodyparser'
import koaSession from 'koa-session'
import router from './services/router'

const Koa = new koa()
const server = http.createServer(Koa.callback())

// https://github.com/venables/koa-helmet
Koa.use(koaHelmet())
// https://github.com/koajs/bodyparser
Koa.use(koaBodyparser())
// https://github.com/koajs/cors
Koa.use(koaCors({
	origin: ctx => {
		if (!global.ENV.HAS_AUTH_SERVICE) return ctx.request.header.origin
		return global.ENV.ALLOWED_ORIGINS.includes(ctx.request.header.origin) ? ctx.request.header.origin : null
	},
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true,
	maxAge: 86400,
}))
// https://github.com/koajs/session
if (global.ENV.HAS_AUTH_SERVICE) {
	Koa.keys = global.ENV.SESSION_KEYS

	Koa.use(koaSession({
		key: 'SID',
	}, Koa))
}
// https://github.com/koajs/router
Koa.use(router.routes())
Koa.use(router.allowedMethods())

server.listen(global.ENV.PORT, () => {
	console.log('Server listening on port: http://localhost:' + global.ENV.PORT)
})
