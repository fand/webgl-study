import Shader from './utils/shader';
declare function require(name: string);

const shaders = [
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas0'), require('./shaders/0.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas1'),
    require('./shaders/1.frag')
  ),
]
