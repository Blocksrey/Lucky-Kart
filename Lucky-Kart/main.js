import {newNetwork} from './network.js'
import {parseObj} from './parseObj.js'
import {Quat} from './GLM/quat.js'
import {Vec2} from './GLM/vec2.js'
import {Vec3} from './GLM/vec3.js'
import {Vec4} from './GLM/vec4.js'
import {Mat2} from './GLM/mat2.js'
import {Mat3} from './GLM/mat3.js'
import {Mat4} from './GLM/mat4.js'
import {newSignal} from './signal.js'
import {gl, canvas, createProgram} from './gl.js'

let rand = Math.random
let sqrt = Math.sqrt

let network = newNetwork(3565)

let vSource = `
uniform float aspectRatio;
uniform mat4 frusT;

attribute vec3 position;
attribute vec2 coord;
attribute vec3 normal;

varying vec3 vPosition;
varying vec2 vCoord;
varying vec3 vNormal;

void main() {
	vPosition = position;
	vCoord = coord;
	vNormal = normal;

	gl_Position = frusT*vec4(position, 1)*vec4(aspectRatio, 1, 1, 1);
}
`

let fSource = `
precision mediump float;

varying vec3 vPosition;
varying vec2 vCoord;
varying vec3 vNormal;

void main() {
	//float b = dot(vNormal, normalize(vec3(-3, 1, -2)));
	//gl_FragColor = vec4(b, b, b, 1);
	//gl_FragColor = vec4(vCoord.x, vCoord.y, 0, 1);
	gl_FragColor = vec4(1, 1, 1, 1);
}
`

let drawLine = (px, py, pz, dx, dy, dz) => {
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		     px,      py,      pz,
		dx + px, dy + py, dz + pz,
	]), gl.STATIC_DRAW)

	gl.drawArrays(gl.TRIANGLES, 0, 3)
}

let program = createProgram(vSource, fSource)
gl.useProgram(program)

let frusTL = gl.getUniformLocation(program, 'frusT')

let main = ([file]) => {
	let model = parseObj(file)
	console.log(model)



	let positionB = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionB)

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model[0]), gl.STATIC_DRAW)

	let positionL = gl.getAttribLocation(program, 'position')
	gl.enableVertexAttribArray(positionL)

	if (positionL < 0)
		console.log('failed to get storage location of attribute')

	gl.vertexAttribPointer(positionL, 3, gl.FLOAT, false, 0, 0)

	/*
	let coordB = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, coordB)

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model[1]), gl.STATIC_DRAW)

	let coordL = gl.getAttribLocation(program, 'coord')
	gl.enableVertexAttribArray(coordL)

	if (coordL < 0)
		console.log('failed to get storage location of attribute')

	gl.vertexAttribPointer(coordL, 2, gl.FLOAT, false, 0, 0)
	*/

	/*
	let normalB = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, normalB)

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model[2]), gl.STATIC_DRAW)

	let normalL = gl.getAttribLocation(program, 'normal')
	gl.enableVertexAttribArray(normalL)

	if (normalL < 0)
		console.log('failed to get storage location of attribute')

	gl.vertexAttribPointer(normalL, 3, gl.FLOAT, false, 0, 0)
	*/





	let aspectRatioL = gl.getUniformLocation(program, 'aspectRatio')
	let aspectRatio

	onresize = function() {
		canvas.width = innerWidth
		canvas.height = innerHeight

		aspectRatio = innerHeight/innerWidth
		gl.uniform1f(aspectRatioL, aspectRatio)

		gl.viewport(0, 0, innerWidth, innerHeight)
	}

	onresize()





	let pi = Math.PI
	let tau = 2*Math.PI

	let gx = 0
	let gy = 0.002

	let ac = -0.0005

	let rad = 2
	let r = 255
	let g = 250
	let b = 150

	//context.lineWidth = 2*rad

	let bullets = []

	let drawStepBullets = td => {
		for (let i = bullets.length; i--;) {
			let [px, py] = bullets[i][0]
			let [vx, vy] = bullets[i][1]

			let k = ac*sqrt(vx*vx + vy*vy)

			let ax = gx + k*vx
			let ay = gy + k*vy

			let dx = td*(vx + 0.5*td*ax)
			let dy = td*(vy + 0.5*td*ay)

			bullets[i][0] = [
				px + dx,
				py + dy,
			]

			bullets[i][1] = [
				vx + td*ax,
				vy + td*ay,
			]

			let l = 2*pi*rad/(pi + sqrt(dx*dx + dy*dy))

			//context.strokeStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + l + ')'
			//context.beginPath()
			//context.moveTo(px, py)
			//context.lineTo(px + dx, py + dy)
			//context.stroke()
		}
	}

	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LESS)

	gl.clearColor(0, 0, 0, 1)

	let tick1 = performance.now()

	let update = function() {
		let tick0 = tick1
		tick1 = performance.now()

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		let frusT =
			Mat4.perspective()
			.mul(Mat4.translation(0, -5, -7 + Math.cos(0.001*performance.now())))
			.mul(Mat4.rotate_y(0.0003*performance.now()))

		gl.uniformMatrix4fv(frusTL, false, frusT.dumpT())

		gl.drawArrays(gl.TRIANGLES, 0, model[0].length/3)

		//drawLine(0.4, 0.2, 0.1, 0.7)

		requestAnimationFrame(update)
	}

	requestAnimationFrame(update)

	/*
	network.receive('bullet').connect(bullet =>
		bullets.push(bullet)
	)

	let b1
	let mp0

	onmousedown = info => {
		b1 = true

		mp0 = [info.clientX, info.clientY]
	}

	onmouseup = info => {
		b1 = false

		let mp1 = [info.clientX, info.clientY]

		for (let i = 9; i--;) {
			network.send([
				'bullet',
				mp0,
				[
					0.01*(mp1[0] - mp0[0]) + rand() - 0.5,
					0.01*(mp1[1] - mp0[1]) + rand() - 0.5
				]
			])
		}
	}
	*/
}

network.open.connect(function() {
	network.send(['fetch', 'mario.obj'])
	network.receive('fetch').connect(main)
})