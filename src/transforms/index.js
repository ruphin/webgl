import {
  fullscreen,
  glsl,
  createVertexShader,
  createFragmentShader,
  createProgram
} from "../webgl.js";
import {
  mat3 as m3,
  glMatrix
} from "../../node_modules/gl-matrix/esm/index.js";

const vertexShaderSource = glsl`#version 300 es

  // an attribute is an input (in) to a vertex shader.
  // It will receive data from a buffer
  in vec2 a_position;

  // A matrix to transform the positions by
  uniform mat3 u_matrix;

  // all shaders have a main function
  void main() {
    // Multiply the position by the matrix.
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  }
`;

const fragmentShaderSource = glsl`#version 300 es

  precision mediump float;

  uniform vec4 u_color;

  // we need to declare an output for the fragment shader
  out vec4 outColor;

  void main() {
    outColor = u_color;
  }
`;

const canvas = document.body.appendChild(document.createElement("canvas"));
fullscreen(canvas, true);
const gl = canvas.getContext("webgl2");

const vertexShader = createVertexShader(gl, vertexShaderSource);
const fragmentShader = createFragmentShader(gl, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

const matrixLocation = gl.getUniformLocation(program, "u_matrix");
const colorLocation = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

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

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Bind the attribute/buffer set we want
gl.bindVertexArray(vao);

let translation = [300, 300];
let rotationInRadians = 0;
const scale = [1, 1];

const color = [Math.random(), Math.random(), Math.random(), 1];
// Set the color
gl.uniform4fv(colorLocation, color);

// Fill the buffer with triangles that form a letter F shape
const loadF = () => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
      // left column
      0,  0,
      30, 0,
      0,  150,
      0,  150,
      30, 0,
      30, 150,

      // top rung
      30,  0,
      100, 0,
      30,  30,
      30,  30,
      100, 0,
      100, 30,

      // middle rung
      30, 60,
      67, 60,
      30, 90,
      30, 90,
      67, 60,
      67, 90
    ]),
    gl.STATIC_DRAW
  );
};

const drawScene = () => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  const matrix = m3.create();
  m3.translate(matrix, matrix, translation);
  m3.rotate(matrix, matrix, rotationInRadians);
  m3.scale(matrix, matrix, scale);
  const projectionMatrix = [];
  m3.projection(
    projectionMatrix,
    gl.drawingBufferWidth,
    gl.drawingBufferHeight
  );

  m3.multiply(matrix, projectionMatrix, matrix);

  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  loadF();

  // Draw the loaded triangles
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 18;
  gl.drawArrays(primitiveType, offset, count);
};

drawScene();

const UIContainer = document.body.appendChild(document.createElement("div"));
UIContainer.style.position = "absolute";

UIContainer.appendChild(document.createElement("span")).innerText =
  "Translate X";
const translateXSlider = UIContainer.appendChild(
  document.createElement("input")
);
translateXSlider.type = "range";
translateXSlider.min = 0;
translateXSlider.max = translation[0] * 2;
translateXSlider.value = translation[0];
translateXSlider.addEventListener("input", () => {
  translation[0] = translateXSlider.value;
  drawScene();
});

UIContainer.appendChild(document.createElement("span")).innerText =
  "Translate Y";
const translateYSlider = UIContainer.appendChild(
  document.createElement("input")
);
translateYSlider.type = "range";
translateYSlider.min = 0;
translateYSlider.max = translation[1] * 2;
translateYSlider.value = translation[1];
translateYSlider.addEventListener("input", () => {
  translation[1] = translateYSlider.value;
  drawScene();
});

UIContainer.appendChild(document.createElement("span")).innerText = "Scale X";
const scaleXSlider = UIContainer.appendChild(document.createElement("input"));
scaleXSlider.type = "range";
scaleXSlider.min = -5;
scaleXSlider.max = 5;
scaleXSlider.step = 0.01;
scaleXSlider.value = scale[0];
scaleXSlider.addEventListener("input", () => {
  scale[0] = scaleXSlider.value;
  drawScene();
});

UIContainer.appendChild(document.createElement("span")).innerText = "Scale Y";
const scaleYSlider = UIContainer.appendChild(document.createElement("input"));
scaleYSlider.type = "range";
scaleYSlider.min = -5;
scaleYSlider.max = 5;
scaleYSlider.step = 0.01;
scaleYSlider.value = scale[1];
scaleYSlider.addEventListener("input", () => {
  scale[1] = scaleYSlider.value;
  drawScene();
});

UIContainer.appendChild(document.createElement("span")).innerText = "Rotation";
const rotationSlider = UIContainer.appendChild(document.createElement("input"));
rotationSlider.type = "range";
rotationSlider.min = 0;
rotationSlider.max = 360;
rotationSlider.value = 0;
rotationSlider.addEventListener("input", () => {
  rotationInRadians = glMatrix.toRadian(rotationSlider.value);
  drawScene();
});
