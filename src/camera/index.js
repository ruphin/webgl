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

  // A matrix to transform the positions by
  uniform mat4 u_matrix;

  // a varying the color to the fragment shader
  out vec2 v_texcoord;

// all shaders have a main function
  void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;

    // Pass the xz coordinate to the fragment shader
    v_texcoord = vec2(a_position.xz);
  }
`;

const fragmentShaderSource = glsl`#version 300 es

  precision mediump float;

  // the varied color passed from the vertex shader
  in vec2 v_texcoord;

  uniform sampler2D u_texture;
  // we need to declare an output for the fragment shader
  out vec4 outColor;

  void main() {
    float total = floor(v_texcoord.x) +
                  floor(v_texcoord.y);
    bool isEven = mod(total,2.0)==0.0;
    vec4 col1 = vec4(0.0,0.0,1.0,1.0);
    vec4 col2 = vec4(1.0,1.0,1.0,1.0);
    outColor = (isEven)? col1:col2;
  }
`;

// Fill the color buffer with colors
const loadTexture = () => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
        0, 0,
        0, 10,
        10, 0,
        0, 10,
        10, 10,
        10, 0
      ]),
    gl.STATIC_DRAW
  );
};

// Fill the buffer with a flat floor panel
const loadGeometry = () => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
      0, 0, 0,
      100, 0, 0,
      0, 0, 100,
      100, 0, 0,
      100, 0, 100,
      0, 0, 100
      ]),
    gl.STATIC_DRAW
  );
};
//////////////////////////
// Standard setup stuff
///////////////////////////
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

////////////////////
// CREATE A TEXTURE
////////////////////

const checkerboardTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, checkerboardTexture);
const WHITE = "rgb(255,255,255)";
const BLUE = "rgb(0,0,255)";
const textureCanvas = document.createElement("canvas");
const textureContext = textureCanvas.getContext("2d");
const textureSize = 2;
const textureHalfSize = textureSize / 2;
textureCanvas.width = textureSize;
textureCanvas.height = textureSize;
textureContext.fillStyle = WHITE;
textureContext.fillRect(0, 0, textureSize, textureSize);
textureContext.fillStyle = BLUE;
textureContext.fillRect(0, 0, textureHalfSize, textureHalfSize);
textureContext.fillRect(
  textureHalfSize,
  textureHalfSize,
  textureSize,
  textureSize
);
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  textureCanvas
);

// Create a texture.
const texture = gl.createTexture();

// use texture unit 0
gl.activeTexture(gl.TEXTURE0 + 0);

// bind to the TEXTURE_2D bind point of texture unit 0
gl.bindTexture(gl.TEXTURE_2D, texture);

// Fill the texture with a 1x1 blue pixel.
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  1,
  1,
  0,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  new Uint8Array([0, 0, 255, 255])
);

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
// TEXTURE STUFF
///////////////////

// The texture coordinate attribute passed to the vertex shader
const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

// Turn it on
gl.enableVertexAttribArray(texcoordAttributeLocation);

// create the texcoord buffer, make it the current ARRAY_BUFFER
// and copy in the texcoord values
const texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
loadTexture();

// Turn on the attribute
gl.enableVertexAttribArray(texcoordAttributeLocation);

// Tell the attribute how to get data out of texture coordinate buffer (ARRAY_BUFFER)
glVertexAttributePointer({
  gl,
  attributeLocation: texcoordAttributeLocation,
  size: 2,
  type: gl.FLOAT,
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

const cameraMoveSpeed = 1;
const moveDirection = [0, 0, 0];
const mouseSensitivity = 0.01;
const FOV = glMatrix.toRadian(60);

const minViewDistance = 1;

///////////////
// Constants
///////////////

const PITCH_MAX = glMatrix.toRadian(89.9);
const PITCH_MIN = -PITCH_MAX;
const UP = [0, 1, 0];
const moving = { forward: 0, left: 0, up: 0 };
let lastPaintTime = Date.now();

//////////////////
// Draw function
//////////////////

const drawScene = paintTime => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;

  // Calculate the new position of the camera (should still be capped directionally)
  const moveDistance = (paintTime - lastPaintTime) * cameraMoveSpeed;
  cameraPosition[0] += moveDirection[0] * moveDistance;
  cameraPosition[1] += moveDirection[1] * moveDistance;
  cameraPosition[2] += moveDirection[2] * moveDistance;

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
  // Compute the x and z position from the angle

  const matrix = viewProjectionMatrix.slice();
  // Orient the floor
  m4.rotateZ(matrix, matrix, glMatrix.toRadian(180));
  m4.scale(matrix, matrix, [100, 1, 100]);
  // Set the matrix to our uniform location for the vertex shader to use
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  // Draw the loaded triangles from the buffer
  const offset = 0;
  const count = 6;
  gl.drawArrays(gl.TRIANGLES, offset, count);

  requestAnimationFrame(drawScene);
  lastPaintTime = paintTime;
};

// snelheids vector, lerp naar doel snelheids vector toe

const calculateMoveDirection = () => {
  console.log(moving);
  const x = -moving.forward * Math.sin(yaw) - moving.left * Math.cos(yaw);
  const z = -moving.forward * Math.cos(yaw) - moving.left * Math.sin(yaw);
  const y = -moving.forward * Math.sin(pitch) - moving.up;
  if (
    (moving.forward && moving.left) ||
    (moving.left && moving.up) ||
    (moving.forward && moving.up)
  ) {
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    moveDirection[0] = x / magnitude;
    moveDirection[1] = y / magnitude;
    moveDirection[2] = z / magnitude;
  } else {
    moveDirection[0] = x;
    moveDirection[1] = y;
    moveDirection[2] = z;
  }
};

document.addEventListener("keydown", e => {
  if (e.repeat) {
    return;
  }
  console.log("DOWN");
  console.log(e.key);
  switch (e.key.toLowerCase()) {
    case "w":
      moving.forward += 1;
      break;
    case "s":
      moving.forward -= 1;
      break;
    case "a":
      moving.left += 1;
      break;
    case "d":
      moving.left -= 1;
      break;
    case " ":
      moving.up += 1;
      break;
    case "shift":
      moving.up -= 1;
      break;
  }
  calculateMoveDirection();
});

document.addEventListener("keyup", e => {
  if (e.repeat) {
    return;
  }
  console.log("UP");
  console.log(e.key);
  switch (e.key.toLowerCase()) {
    case "w":
      moving.forward -= 1;
      break;
    case "s":
      moving.forward += 1;
      break;
    case "a":
      moving.left -= 1;
      break;
    case "d":
      moving.left += 1;
      break;
    case " ":
      moving.up -= 1;
      break;
    case "shift":
      moving.up += 1;
      break;
  }
  calculateMoveDirection();
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
