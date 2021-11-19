import {newSignal} from './signal.js'
import {WebSocketServer} from 'ws'

export function newNetwork(server) {
	let network = {}

	network.open = newSignal()
	network.close = newSignal()
	network.error = newSignal()

	let ss = new WebSocketServer({server})

	let sockets = []

	network.send = params => {
		for (let id in sockets)
			if (sockets[id])
				sockets[id].send(JSON.stringify(params))
	}

	let listeners = {}

	network.receive = key => {
		if (listeners[key])
			return listeners[key]
		return listeners[key] = newSignal()
	}

	let index = 0

	ss.on('connection', socket => {
		let id = ++index

		sockets[id] = socket

		socket.on('close', () =>
			sockets[id] = null
		)

		socket.on('message', message => {
			let [key, ...args] = JSON.parse(message.toString())
			if (listeners[key])
				listeners[key].fire(args)
			else
				console.log('no key: ' + key)
		})
	})

	return network
}