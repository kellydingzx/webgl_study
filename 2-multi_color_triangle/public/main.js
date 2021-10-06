const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl){
    throw new Error('WebGL not supported');
}

// vertexData = [...]

// create buffer
// load vertexData into buffer

// create vertex shader
// create fragment shader
// create program
// attach shaders to program

// enable vertex attributes

// draw

const vertex_data = [
    0,1,0,
    1,-1,0,
    -1,-1,0
];

const color_data = [
    1,0,0, //RGB values - red
    0,1,0,
    0,0,1
]

const vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_data), gl.STATIC_DRAW);

const color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_data), gl.STATIC_DRAW);

const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertex_shader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 v_color;
void main() {
    v_color = color;
    gl_Position = vec4(position, 1);
}
`);
gl.compileShader(vertex_shader)

const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragment_shader, `
precision mediump float;
varying vec3 v_color;
void main() {
    gl_FragColor = vec4(v_color, 1);
}
`);
gl.compileShader(fragment_shader);

const program = gl.createProgram();
gl.attachShader(program, vertex_shader);
gl.attachShader(program, fragment_shader);
gl.linkProgram(program);

// enable vertex attributes
const position_location = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(position_location);
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)
gl.vertexAttribPointer(position_location, 3, gl.FLOAT, false, 0, 0);

const color_location = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(color_location);
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.vertexAttribPointer(color_location, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);