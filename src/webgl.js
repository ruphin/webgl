export const fullscreen = (canvas, hiDPI = false) => {
  document.body.style.display = "flex";
  document.body.style.margin = 0;
  canvas.style.height = "100vh";
  canvas.style.width = "100vw";
  const pixelRatio = (hiDPI && window.devicePixelRatio) || 1;
  const fullscreenSize = () => {
    const width = Math.floor(window.innerWidth * pixelRatio);
    const height = Math.floor(window.innerHeight * pixelRatio);
    resize(canvas, height, width);
  };
  window.addEventListener("resize", fullscreenSize);
  fullscreenSize();
};

export const resize = (canvas, height, width) => {
  canvas.height = height;
  canvas.width = width;
};

export const createVertexShader = (gl, source) =>
  createShader(gl, gl.VERTEX_SHADER, source);

export const createFragmentShader = (gl, source) =>
  createShader(gl, gl.FRAGMENT_SHADER, source);

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw Error("Shader failed to compile");
  }
  return shader;
};

export const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw Error("Program failed to link");
  }
  return program;
};

export const glsl = (statics, ...dynamics) =>
  dynamics
    .map((dynamic, index) => `${statics[index]}${String(dynamic)}`)
    .join("") + statics[dynamics.length];

export const m3 = {
  projection: (width, height) => {
    // Note: This matrix flips the Y axis so that 0 is at the top.

    // prettier-ignore
    return [2 / width, 0,           0, 
            0,         -2 / height, 0, 
            -1,        1,           1];
  },

  translation: function translation(tx, ty) {
    // prettier-ignore
    return [1,  0,  0, 
            0,  1,  0, 
            tx, ty, 1];
  },

  rotation: function rotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    // prettier-ignore
    return [c, -s, 0, 
            s, c,  0, 
            0, 0,  1];
  },

  scaling: function scaling(sx, sy) {
    // prettier-ignore
    return [sx, 0,  0, 
            0,  sy, 0, 
            0,  0,  1];
  },

  multiply: function multiply(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22
    ];
  }
};
