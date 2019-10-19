import { fullscreen } from "../webgl.js";

const vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;

// all shaders have a main function
void main() {

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec4 u_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = u_color;
}
`;

const createShader = (type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.warn(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

const createProgram = (vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.warn(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

const canvas = document.body.appendChild(document.createElement("canvas"));
fullscreen(canvas, true);
const gl = canvas.getContext("webgl2");

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = createProgram(vertexShader, fragmentShader);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// look up uniform locations
const resolutionUniformLocation = gl.getUniformLocation(
  program,
  "u_resolution"
);
const colorLocation = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = [-0.5, -0.5, 0.5, 0.5, 0.5, -0.5];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);

const size = 2; // 2 components per iteration
const type = gl.FLOAT; // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  offset
);

////////////////////////////////

// Fill the buffer with the values that define a rectangle.
const setRectangle = (x, y, width, height) => {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
};

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Bind the attribute/buffer set we want.
gl.bindVertexArray(vao);

// Pass in the canvas resolution so we can convert from
// pixels to clipspace in the shader
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

const drawScene = () => {
  // Clear the canvas
  // gl.clearColor(0, 0, 0, 0);
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  setRectangle(translation[0], translation[1], width, height);

  // Set a random color.
  gl.uniform4fv(colorLocation, color);

  // Draw the rectangle.
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
};

let count = 0;
let translation;
let width = 200;
let height = 200;
let color = [Math.random(), Math.random(), Math.random(), 1];

const step = () => {
  window.requestAnimationFrame(() => {
    count += 3;
    const moveWidth = gl.canvas.width - width;
    const moveHeight = gl.canvas.height - height;
    translation = [
      Math.abs((count % (2 * moveWidth)) - moveWidth),
      Math.abs((count % (2 * moveHeight)) - moveHeight)
    ];

    drawScene();
    step();
  });
};
step();
