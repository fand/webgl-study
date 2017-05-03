import Shader from './shader';
declare function require(name: string);

const shaders = [
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas0'), require('./shader0.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas1'), require('./shader1.frag')
  ),
]
