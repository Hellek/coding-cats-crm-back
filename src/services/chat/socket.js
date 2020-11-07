export default function (io, socket) {
	socket.on('chat/user-credentials', user => {
		socket.user = user
		socket.broadcast.emit('chat/user/connect', user)
	})

	socket.on('chat', text => {
		io.emit('chat', {
			user: socket.user,
			text,
			time: new Date,
		})
	})

	socket.on('disconnect', () => {
		io.emit('chat/user/disconnect', socket.user)
	})
}
