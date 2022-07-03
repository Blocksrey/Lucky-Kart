import {readFileSync} from 'fs'
import {initClientDistributor} from './cd.js'
import {newNetwork} from './network.js'

let server = initClientDistributor(3565)
let network = newNetwork(server)

network.receive('bullet').connect(([...args]) =>
	network.send(['bullet', ...args])
)

network.receive('fetch').connect(([path]) =>
	network.send(['fetch', readFileSync(path).toString()])
)