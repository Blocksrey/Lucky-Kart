let canvas = document.querySelector('canvas')

let gl = canvas.getContext('webgl2')
if (!gl)
	console.log('webgl fail')

let createShader = (type, source) => {
	let shader = gl.createShader(type)

	gl.shaderSource(shader, source)

	gl.compileShader(shader)

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		console.log(gl.getShaderInfoLog(shader))

	return shader
}

let createProgram = (vSource, fSource) => {
	let vShader = createShader(gl.VERTEX_SHADER, vSource)
	let fShader = createShader(gl.FRAGMENT_SHADER, fSource)

	let program = gl.createProgram(vShader, fShader)

	gl.attachShader(program, vShader)
	gl.attachShader(program, fShader)

	gl.linkProgram(program)

	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
		console.log(gl.getProgramInfoLog(program))

	return program
}

export {
	canvas,
	gl,
	createShader,
	createProgram
}