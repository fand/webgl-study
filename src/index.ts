import ThreeShader from './three-shader';
import * as inView from 'in-view';

declare function require(name: string);

const shaders = [
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas15'),
    require('./shaders/15.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas14'),
    require('./shaders/14.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas13'),
    require('./shaders/13.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas12'),
    require('./shaders/12.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas11'),
    require('./shaders/11.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas10'),
    require('./shaders/10.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas9'),
    require('./shaders/9.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas8'),
    require('./shaders/8.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas7'),
    require('./shaders/7.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas6'),
    require('./shaders/6.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas5'),
    require('./shaders/5.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas4'),
    require('./shaders/4.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas3'),
    require('./shaders/3.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas2'),
    require('./shaders/2.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas1'),
    require('./shaders/1.frag')
  ),
  new ThreeShader(
    <HTMLElement>document.querySelector('#canvas0'),
    require('./shaders/0.frag')
  ),
]

inView('.canvas')
    .on('enter', el => {
        ThreeShader.map.get(el).toggle();
    })
    .on('exit', el => {
        ThreeShader.map.get(el).toggle();
    });
