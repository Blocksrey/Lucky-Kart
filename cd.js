import {readFileSync} from 'fs'
import {createServer} from 'https'

let MIMEs = {
	'html': 'text/html',
	'js': 'application/javascript',
	'ico': 'image/x-icon',
	'obj': 'model/obj',
	'mtl': 'model/mtl'
}

export function initClientDistributor(port) {
	return createServer(
		{
			key: readFileSync('ssl/private.key.pem'),
			cert: readFileSync('ssl/domain.cert.pem'),
			ca: readFileSync('ssl/intermediate.cert.pem')
		},
		(request, response) => {
			if (request.url == '/')
				request.url += 'index.html'

			request.url = '/Lucky_Kart' + request.url

			console.log(request.url)

			try {
				response.setHeader('Access-Control-Allow-Origin', '*')
				response.setHeader('Content-Type', MIMEs[request.url.split('.').pop()])
				response.end(readFileSync(request.url.substr(1)))
			}
			catch (error) {
				console.log(error)
			}
		}
	).listen(port)
}