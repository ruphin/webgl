import {
  fullscreen,
  glsl,
  createVertexShader,
  createFragmentShader,
  createProgram,
  glVertexAttributePointer
} from "../webgl.js";
import {
  mat4 as m4,
  glMatrix
} from "../../node_modules/gl-matrix/esm/index.js";

const vertexShaderSource = glsl`#version 300 es

  // an attribute is an input (in) to a vertex shader.
  // It will receive data from a buffer
  in vec4 a_position;
  in vec4 a_color;

  // A matrix to transform the positions by
  uniform mat4 u_matrix;

  // a varying the color to the fragment shader
  out vec4 v_color;

// all shaders have a main function
  void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;

    // Pass the color to the fragment shader.
    v_color = a_color;
  }
`;

const fragmentShaderSource = glsl`#version 300 es

  precision mediump float;

  // the varied color passed from the vertex shader
  in vec4 v_color;

  // we need to declare an output for the fragment shader
  out vec4 outColor;

  void main() {
    outColor = v_color;
  }
`;

// Fill the color buffer with colors
const loadColors = () => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Uint8Array([
          // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

          // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

          // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

          // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

          // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

          // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

          // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

          // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

          // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

          // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
      ]),
    gl.STATIC_DRAW
  );
};

// Fill the buffer with triangles that form a letter F shape
const loadGeometry = () => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
          // left column front
          0,   0,  0,
          0, 150,  0,
          30,   0,  0,
          0, 150,  0,
          30, 150,  0,
          30,   0,  0,

          // top rung front
          30,   0,  0,
          30,  30,  0,
          100,   0,  0,
          30,  30,  0,
          100,  30,  0,
          100,   0,  0,

          // middle rung front
          30,  60,  0,
          30,  90,  0,
          67,  60,  0,
          30,  90,  0,
          67,  90,  0,
          67,  60,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   60,  30,
          30,   30,  30,
          30,   30,   0,
          30,   60,   0,
          30,   60,  30,

          // top of middle rung
          30,   60,   0,
          67,   60,  30,
          30,   60,  30,
          30,   60,   0,
          67,   60,   0,
          67,   60,  30,

          // right of middle rung
          67,   60,   0,
          67,   90,  30,
          67,   60,  30,
          67,   60,   0,
          67,   90,   0,
          67,   90,  30,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,  150,  30,
          30,   90,  30,
          30,   90,   0,
          30,  150,   0,
          30,  150,  30,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0,
      ]),
    gl.STATIC_DRAW
  );
};

const canvas = document.body.appendChild(document.createElement("canvas"));
fullscreen(canvas, true);
const gl = canvas.getContext("webgl2");

const vertexShader = createVertexShader(gl, vertexShaderSource);
const fragmentShader = createFragmentShader(gl, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Enable directional culling
gl.enable(gl.CULL_FACE);

// Depth culling
gl.enable(gl.DEPTH_TEST);

// The matrix uniform passed to the vertex shader
const matrixLocation = gl.getUniformLocation(program, "u_matrix");

// Create the vertex array (?)
const vao = gl.createVertexArray();
// Make it the current vertex array
gl.bindVertexArray(vao);

///////////////////
// POSITION STUFF
///////////////////

// The position attribute passed to the vertex shader
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// Turn it on
gl.enableVertexAttribArray(positionAttributeLocation);

// Make a buffer for the geometry
const positionBuffer = gl.createBuffer();

// Use this buffer as the current ARRAY_BUFFER
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Load the geometry into ARRAY_BUFFER
loadGeometry();

// Tell the attribute how to read data from the buffer
glVertexAttributePointer({
  gl,
  attributeLocation: positionAttributeLocation,
  size: 3,
  type: gl.FLOAT,
  normalize: false,
  stride: 0,
  offset: 0
});

///////////////////
// COLOR STUFF
///////////////////

// The color attribute passed to the vertex shader
const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

// Turn it on
gl.enableVertexAttribArray(colorAttributeLocation);

// Make a buffer for the colors
const colorBuffer = gl.createBuffer();

// Use this buffer as the current ARRAY_BUFFER
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

// Load the geometry into ARRAY_BUFFER
loadColors();

// Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
glVertexAttributePointer({
  gl,
  attributeLocation: colorAttributeLocation,
  size: 3,
  type: gl.UNSIGNED_BYTE,
  normalize: true,
  stride: 0,
  offset: 0
});

const drawScene = ms => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const rotationsPerMs = 1 / 3000;
  const cameraAngle = glMatrix.toRadian(ms * rotationsPerMs * 360);
  const fCount = 5;
  const radius = 200;

  const near = 1;
  const far = 2000;

  const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  const fieldOfView = glMatrix.toRadian(60);

  const cameraMatrix = [];
  m4.fromYRotation(cameraMatrix, cameraAngle);
  m4.translate(cameraMatrix, cameraMatrix, [0, 50, radius * 1.5]);

  // Where to look with the camera
  const focusPoint = [-radius, 0, 0];

  // cameraMatrix[12..14] contains the computed position of our camera
  const up = [0, 1, 0];
  const viewMatrix = [];
  m4.lookAt(viewMatrix, cameraMatrix.slice(12, 15), focusPoint, up);

  const projectionMatrix = [];
  // The projection frustum
  m4.perspective(projectionMatrix, fieldOfView, aspectRatio, near, far);

  const viewProjectionMatrix = [];
  m4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

  // For each of the Fs in fCount
  [...Array(fCount)].forEach((_, i) => {
    // Arrange them in a circle
    const angle = glMatrix.toRadian((i * 360) / fCount);

    // Compute the x and z position from the angle
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const matrix = viewProjectionMatrix.slice();
    // Orient the Fs properly
    m4.rotateZ(matrix, matrix, glMatrix.toRadian(180));
    m4.translate(matrix, matrix, [x - 50, -75, z - 15]);

    // Set the matrix to our uniform location for the vertex shader to use
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the loaded triangles from the buffer
    const offset = 0;
    const count = 16 * 6;
    gl.drawArrays(gl.TRIANGLES, offset, count);
  });
  requestAnimationFrame(drawScene);
};

requestAnimationFrame(drawScene);
