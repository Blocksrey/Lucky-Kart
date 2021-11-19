import {newSignal} from './signal.js'

export function newNetwork(port) {
	let network = {}

	network.open = newSignal()
	network.close = newSignal()
	network.error = newSignal()

	let socket = new WebSocket('wss://home.pyusoft.com:' + port)

	socket.onopen = network.open.fire
	socket.onclose = network.close.fire
	socket.onerror = network.error.fire

	let listeners = {}

	network.receive = key => {
		if (listeners[key])
			return listeners[key]
		return listeners[key] = newSignal()
	}

	socket.onmessage = packet => {
		let [key, ...args] = JSON.parse(packet.data)
		if (listeners[key])
			listeners[key].fire(args)
		else
			console.log('no key: ' + key)
	}

	network.send = params =>
		socket.send(JSON.stringify(params))

	return network
}