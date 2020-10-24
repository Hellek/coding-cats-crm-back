import './core/ENV'
import koa from 'koa'
import http from 'http'

const Koa = new koa()
const server = http.createServer(Koa.callback())

server.listen(global.ENV.PORT, () => {
	console.log('Server listening on port: http://localhost:' + global.ENV.PORT)
})
