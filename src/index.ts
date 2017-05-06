import Shader from './utils/shader';
declare function require(name: string);

const shaders = [
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas10'),
    require('./shaders/10.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas9'),
    require('./shaders/9.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas8'),
    require('./shaders/8.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas7'),
    require('./shaders/7.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas6'),
    require('./shaders/6.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas5'),
    require('./shaders/5.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas4'),
    require('./shaders/4.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas3'),
    require('./shaders/3.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas2'),
    require('./shaders/2.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas1'),
    require('./shaders/1.frag')
  ),
  new Shader(
    <HTMLCanvasElement>document.querySelector('#canvas0'),
    require('./shaders/0.frag')
  ),
]
