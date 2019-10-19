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
