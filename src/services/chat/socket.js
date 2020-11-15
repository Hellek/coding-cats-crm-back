const chatUsers = {}
const messages = []

export default function (io, socket) {
	socket.on('chat/user/join', user => {
		chatUsers[user.id] = user
		socket.user = user
		socket.emit('chat/messages/update', messages)
		io.emit('chat/users/update', chatUsers)
	})

	socket.on('chat', ({ text, time }) => {
		if (!text.trim()) return

		const message = {
			user: socket.user,
			text,
			time,
		}

		messages.push(message)
		io.emit('chat', message)
	})

	socket.on('disconnect', () => {
		if (socket.user) delete chatUsers[socket.user.id]
		io.emit('chat/users/update', chatUsers)
	})
}
