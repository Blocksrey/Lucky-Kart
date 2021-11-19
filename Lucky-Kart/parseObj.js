var pre, out, hash = {}

hash['#'] = () => {}
hash[''] = () => {}

hash.mtllib = () => {}
hash.usemtl = () => {}

hash.o = () => {}
hash.s = () => {}

hash.v  = chunk => pre[0].push(chunk)
hash.vt = chunk => pre[1].push(chunk)
hash.vn = chunk => pre[2].push(chunk)

hash.f = chunk => {
	for (var i in chunk) {
		var args = chunk[i].split('/')
		for (var j in args)
			for (var k in pre[j][args[j] - 1])
				out[j].push(+pre[j][args[j] - 1][k])
	}
}

export function parseObj(source) {
	var time0 = performance.now()

	pre = [[], [], []]
	out = [[], [], []]

	var lines = source.split('\n')
	for (var i in lines) {
		var args = lines[i].split(' ')
		hash[args[0]](args.splice(1))
	}

	var time1 = performance.now()
	console.log(time1 - time0)

	return out
}