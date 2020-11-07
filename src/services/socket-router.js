// https://socket.io/docs/emit-cheatsheet/
import socketIo from 'socket.io'
import chat from './chat/socket'

export default function (httpServer) {
	const io = socketIo(httpServer)

	io.on('connect', socket => {
		chat(io, socket)
	})
}
