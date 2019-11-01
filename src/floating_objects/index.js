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

///////////////
// Variables
///////////////

let pitch = -0.8;
let yaw = -0.4;
const viewDirection = [];
m4.fromYRotation(viewDirection, yaw);
m4.rotateX(viewDirection, viewDirection, pitch);
const cameraPosition = [-800, 1700, 2000];

const fGridSize = 50;
const fGridDistance = 200;

const cameraMoveSpeed = 1;
const mouseSensitivity = 0.01;
const FOV = glMatrix.toRadian(60);

const minViewDistance = 1;

///////////////
// Constants
///////////////

const PITCH_MAX = glMatrix.toRadian(89.9);
const PITCH_MIN = -PITCH_MAX;
const UP = [0, 1, 0];
const moving = {};
let lastPaintTime = Date.now();

//////////////////
// Draw function
//////////////////

const drawScene = paintTime => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a point to draw an F that other Fs will look at
  const focusAngle = glMatrix.toRadian(paintTime / 10);
  const focusDistance = 1000;
  // It rotates around the Y axis
  const focusPoint = [
    Math.sin(focusAngle) * focusDistance,
    -cameraPosition[1] / 2,
    Math.cos(focusAngle) * focusDistance
  ];

  const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;

  // Calculate the new position of the camera (should still be capped directionally)
  const moveDistance = (paintTime - lastPaintTime) * cameraMoveSpeed;
  if (moving.forward) {
    cameraPosition[0] -= Math.sin(yaw) * moveDistance;
    cameraPosition[2] -= Math.cos(yaw) * moveDistance;
    cameraPosition[1] += Math.sin(pitch) * moveDistance;
  }
  if (moving.backward) {
    cameraPosition[0] += Math.sin(yaw) * moveDistance;
    cameraPosition[2] += Math.cos(yaw) * moveDistance;
    cameraPosition[1] -= Math.sin(pitch) * moveDistance;
  }
  if (moving.left) {
    cameraPosition[0] -= Math.cos(yaw) * moveDistance;
    cameraPosition[2] += Math.sin(yaw) * moveDistance;
  }
  if (moving.right) {
    cameraPosition[0] += Math.cos(yaw) * moveDistance;
    cameraPosition[2] -= Math.sin(yaw) * moveDistance;
  }
  if (moving.up) {
    cameraPosition[1] += moveDistance;
  }
  if (moving.down) {
    cameraPosition[1] -= moveDistance;
  }

  const cameraMatrix = [];
  m4.fromTranslation(cameraMatrix, cameraPosition);
  m4.multiply(cameraMatrix, cameraMatrix, viewDirection);

  const viewMatrix = [];
  m4.invert(viewMatrix, cameraMatrix);

  const projectionMatrix = [];
  // The projection frustum
  m4.perspective(projectionMatrix, FOV, aspectRatio, minViewDistance);

  const viewProjectionMatrix = [];
  m4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

  // Create a NxN grid of Fs
  [...Array(fGridSize)].forEach((_, xIndex) => {
    [...Array(fGridSize)].forEach((_, zIndex) => {
      // Compute the x and z position from the angle
      const x = (xIndex - fGridSize / 2) * fGridDistance;
      const z = (zIndex - fGridSize / 2) * fGridDistance;

      const matrix = viewProjectionMatrix.slice();
      // Orient the Fs properly
      m4.rotateZ(matrix, matrix, glMatrix.toRadian(180));
      if ((xIndex + zIndex) % 2) {
        const focusMatrix = [];
        m4.targetTo(focusMatrix, [x - 25, -38, z - 8], focusPoint, UP);
        m4.multiply(matrix, matrix, focusMatrix);
        m4.translate(matrix, matrix, [-25, -37, -7]);
      } else {
        m4.translate(matrix, matrix, [x - 50, -75, z - 15]);
      }
      // Set the matrix to our uniform location for the vertex shader to use
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      // Draw the loaded triangles from the buffer
      const offset = 0;
      const count = 16 * 6;
      gl.drawArrays(gl.TRIANGLES, offset, count);
    });
  });

  // Draw the F that is the focus
  const matrix = viewProjectionMatrix.slice();
  const focusMatrix = [];
  // Make it look at the camera
  m4.targetTo(
    focusMatrix,
    [-focusPoint[0], -focusPoint[1], focusPoint[2]],
    cameraPosition,
    UP
  );
  m4.multiply(matrix, matrix, focusMatrix);
  // m4.rotateX(matrix, matrix, Math.PI);
  m4.rotateZ(matrix, matrix, Math.PI);
  // m4.translate(matrix, matrix, focusPoint);

  gl.uniformMatrix4fv(matrixLocation, false, matrix);
  const offset = 0;
  const count = 16 * 6;
  gl.drawArrays(gl.TRIANGLES, offset, count);

  requestAnimationFrame(drawScene);
  lastPaintTime = paintTime;
};

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "w":
    case "W":
      moving.forward = true;
      break;
    case "s":
    case "S":
      moving.backward = true;
      break;
    case "a":
    case "A":
      moving.left = true;
      break;
    case "d":
    case "D":
      moving.right = true;
      break;
    case " ":
      moving.up = true;
      break;
    case "Shift":
      moving.down = true;
      break;
  }
});

document.addEventListener("keyup", e => {
  switch (e.key) {
    case "w":
    case "W":
      moving.forward = false;
      break;
    case "s":
    case "S":
      moving.backward = false;
      break;
    case "a":
    case "A":
      moving.left = false;
      break;
    case "d":
    case "D":
      moving.right = false;
      break;
    case " ":
      moving.up = false;
      break;
    case "Shift":
      moving.down = false;
      break;
  }
});

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", updateViewDirection);
  } else {
    document.removeEventListener("mousemove", updateViewDirection);
  }
});

const updateViewDirection = e => {
  pitch -= e.movementY * mouseSensitivity;
  yaw -= e.movementX * mouseSensitivity;
  if (pitch > PITCH_MAX) {
    pitch = PITCH_MAX;
  } else if (pitch < PITCH_MIN) {
    pitch = PITCH_MIN;
  }
  m4.fromYRotation(viewDirection, yaw);
  m4.rotateX(viewDirection, viewDirection, pitch);
};

requestAnimationFrame(drawScene);

const UIContainer = document.body.appendChild(document.createElement("div"));
UIContainer.style.position = "absolute";

UIContainer.appendChild(document.createElement("span")).innerText =
  "Click anywhere to capture mouse. Move with WASD Shift Space";
