function getImg (width, height) {
  canvas.width = width;
  canvas.height = height;
  parameters.screenWidth = width;
  parameters.screenHeight = height;

  gl.viewport(0, 0, width, height);
  createRenderTargets();
  resetSurface();
  render();
  const img = canvas.toDataURL('image/png');
  onWindowResize();
  return img;
}

// dummy functions
function setURL(fragment) {
}
