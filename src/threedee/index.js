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

//////////////
// Variables
//////////////

const translation = [0, 0, -400];
const rotation = [0.2, 3.4, 3.4];
const scale = [1, 1, 1];

const drawScene = () => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const near = 1;
  const far = 2000;

  const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  const fieldOfView = glMatrix.toRadian(90);

  const matrix = [];

  // The projection frustum
  m4.perspective(matrix, fieldOfView, aspectRatio, near, far);
  m4.translate(matrix, matrix, translation);
  m4.rotateX(matrix, matrix, rotation[0]);
  m4.rotateY(matrix, matrix, rotation[1]);
  m4.rotateZ(matrix, matrix, rotation[2]);
  m4.scale(matrix, matrix, scale);

  // Set the matrix to our uniform location for the vertex shader to use
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  // Draw the loaded triangles from the buffer
  const offset = 0;
  const count = 16 * 6;
  gl.drawArrays(gl.TRIANGLES, offset, count);
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
translateXSlider.min = -600;
translateXSlider.max = 600;
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
translateYSlider.min = -600;
translateYSlider.max = 600;
translateYSlider.value = translation[1];
translateYSlider.addEventListener("input", () => {
  translation[1] = translateYSlider.value;
  drawScene();
});

UIContainer.appendChild(document.createElement("span")).innerText =
  "Translate Z";
const translateZSlider = UIContainer.appendChild(
  document.createElement("input")
);
translateZSlider.type = "range";
translateZSlider.min = -1200;
translateZSlider.max = -1;
translateZSlider.value = translation[2];
translateZSlider.addEventListener("input", () => {
  translation[2] = translateZSlider.value;
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

UIContainer.appendChild(document.createElement("span")).innerText = "Scale Z";
const scaleZSlider = UIContainer.appendChild(document.createElement("input"));
scaleZSlider.type = "range";
scaleZSlider.min = -5;
scaleZSlider.max = 5;
scaleZSlider.step = 0.01;
scaleZSlider.value = scale[2];
scaleZSlider.addEventListener("input", () => {
  scale[2] = scaleZSlider.value;
  drawScene();
});

UIContainer.appendChild(document.createElement("span")).innerText = "Rotate X";
const rotateXSlider = UIContainer.appendChild(document.createElement("input"));
rotateXSlider.type = "range";
rotateXSlider.min = 0;
rotateXSlider.max = 360;
rotateXSlider.value = rotation[0];
rotateXSlider.addEventListener("input", () => {
  rotation[0] = glMatrix.toRadian(rotateXSlider.value);
  drawScene();
});

UIContainer.appendChild(document.createElement("span")).innerText = "Rotate Y";
const rotateYSlider = UIContainer.appendChild(document.createElement("input"));
rotateYSlider.type = "range";
rotateYSlider.min = 0;
rotateYSlider.max = 360;
rotateYSlider.value = rotation[1];
rotateYSlider.addEventListener("input", () => {
  rotation[1] = glMatrix.toRadian(rotateYSlider.value);
  drawScene();
});

UIContainer.appendChild(document.createElement("span")).innerText = "Rotate Z";
const rotateZSlider = UIContainer.appendChild(document.createElement("input"));
rotateZSlider.type = "range";
rotateZSlider.min = 0;
rotateZSlider.max = 360;
rotateZSlider.value = rotation[2];
rotateZSlider.addEventListener("input", () => {
  rotation[2] = glMatrix.toRadian(rotateZSlider.value);
  drawScene();
});

// window.addEventListener("mousemove", e => {
//   translation[0] = -e.clientX + gl.canvas.clientWidth / 2;
//   translation[1] = e.clientY - gl.canvas.clientHeight / 2;
//   drawScene();
// });
