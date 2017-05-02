import Shader from './shader';

const shaders = [
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas0'), document.querySelector('#shader0').textContent
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas1'), document.querySelector('#shader1').textContent
  ),
]
