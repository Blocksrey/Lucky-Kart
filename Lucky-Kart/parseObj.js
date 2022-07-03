'use strict'

let pre, out, def = {}

def['#'] = () => {}
def['']  = () => {}

def.mtllib = () => {}
def.usemtl = () => {}

def.o = () => {}
def.s = () => {}

def.v  = chunk => pre[0].push(chunk)
def.vt = chunk => pre[1].push(chunk)
def.vn = chunk => pre[2].push(chunk)

def.f = chunk => {
	for (let i in chunk) {
		let args = chunk[i].split('/')
		for (let j in args)
			for (let k in pre[j][args[j] - 1])
				out[j].push(+pre[j][args[j] - 1][k])
	}
}

export function parseObj(source) {
	let t0 = performance.now()

	pre = [[], [], []]
	out = [[], [], []]

	let lines = source.split('\n')
	for (let i in lines) {
		let args = lines[i].split(' ')
		def[args[0]](args.splice(1))
	}

	let t1 = performance.now()
	console.log(t1 - t0)

	return out
}