var gl;
function initGL(canvas) {
	try {
		gl = canvas.getContext("webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function RaytracingDemo() {
}

RaytracingDemo.prototype.initShaders = function() {

	this.shaderProgram = gl.createProgram();

	gl.attachShader(this.shaderProgram, getShader(gl, "RaytracingDemoVS"));
	gl.attachShader(this.shaderProgram, getShader(gl, "RaytracingDemoFS"));
	gl.linkProgram(this.shaderProgram);

	if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(this.shaderProgram);

	this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "position");
	gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

	this.shaderProgram.projectionMatrixUniform = gl.getUniformLocation(this.shaderProgram, "projectionMatrix");
    this.shaderProgram.modelviewMatrixUniform = gl.getUniformLocation(this.shaderProgram, "modelViewMatrix");

    // Add resolution uniform
    //getRenderTargetWidth(),
	//getRenderTargetHeight()
    gl.uniform2f(
		gl.getUniformLocation(this.shaderProgram, "g_resolution"),
		1500,900
        );
}

RaytracingDemo.prototype.initBuffers = function() {
	this.triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);

	var vertices = [
		 -1,  -1,  0,
		 -1,  1,  0,
		 1,  1,  0,

		 -1,  -1,  0,
		 1,  -1,  0,
		 1,  1,  0,
	 ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.triangleVertexPositionBuffer.itemSize = 3;
	this.triangleVertexPositionBuffer.numItems = 3 * 2;
}

RaytracingDemo.prototype.drawScene = function() {

	var perspectiveMatrix = new J3DIMatrix4();
	perspectiveMatrix.setUniform(gl, this.shaderProgram.projectionMatrixUniform, false);

	var modelViewMatrix = new J3DIMatrix4();
	modelViewMatrix.setUniform(gl, this.shaderProgram.modelviewMatrixUniform, false);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
	gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
}

RaytracingDemo.prototype.run = function() {
	this.initShaders();
	this.initBuffers();

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT);

	this.drawScene();
};

function init() {
	env = new RaytracingDemo();
	env.run();

    return env;
}

function compute(canvas)
{
    env.initShaders();
    env.initBuffers();

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);

    env.drawScene();
}

//added
const canvas = document.querySelector('canvas');
initGL(canvas);
init();