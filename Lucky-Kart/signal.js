export function newSignal() {
	let signal = {}

	let events = []

	signal.connect = func => {
		events.push(func)
		return () =>
			events.splice(events.indexOf(func), 1)
	}

	signal.fire = args => {
		for (let i in events)
			events[i](args)
	}

	return signal
}