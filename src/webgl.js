export const fullscreen = (canvas, hiDPI = false) => {
  document.body.style.display = "flex";
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
  canvas.style.height = `${height}px`;
  canvas.style.width = `${width}px`;
  canvas.height = height;
  canvas.width = width;
};
