import socketIo from 'socket.io'

export default function (httpServer) {
	const io = socketIo(httpServer)

	io.on('connect', socket => {
		socket.on('disconnect', msg => {
		})
	})
}
