import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';

declare function require(name: string);

const shaders = [
    require('./shaders/26.frag'),
    require('./shaders/25.frag'),
    require('./shaders/24.frag'),
    require('./shaders/23.frag'),
    require('./shaders/22.frag'),
    require('./shaders/21.frag'),
    require('./shaders/20.frag'),
    require('./shaders/19.frag'),
    require('./shaders/18.frag'),
    require('./shaders/17.frag'),
    require('./shaders/16.frag'),
    require('./shaders/15.frag'),
    require('./shaders/14.frag'),
    require('./shaders/13.frag'),
    require('./shaders/12.frag'),
    require('./shaders/11.frag'),
    require('./shaders/10.frag'),
    require('./shaders/9.frag'),
    require('./shaders/8.frag'),
    require('./shaders/7.frag'),
    require('./shaders/6.frag'),
    require('./shaders/5.frag'),
    require('./shaders/4.frag'),
    require('./shaders/3.frag'),
    require('./shaders/2.frag'),
    require('./shaders/1.frag'),
    require('./shaders/0.frag'),
];
const texts = [
    require('./shaders/26.md'),
    require('./shaders/25.md'),
    require('./shaders/24.md'),
    require('./shaders/23.md'),
    require('./shaders/22.md'),
    require('./shaders/21.md'),
    require('./shaders/20.md'),
    require('./shaders/19.md'),
    require('./shaders/18.md'),
    require('./shaders/17.md'),
    require('./shaders/16.md'),
    require('./shaders/15.md'),
    require('./shaders/14.md'),
    require('./shaders/13.md'),
    require('./shaders/12.md'),
    require('./shaders/11.md'),
    require('./shaders/10.md'),
    require('./shaders/9.md'),
    require('./shaders/8.md'),
    require('./shaders/7.md'),
    require('./shaders/6.md'),
    require('./shaders/5.md'),
    require('./shaders/4.md'),
    require('./shaders/3.md'),
    require('./shaders/2.md'),
    require('./shaders/1.md'),
    require('./shaders/0.md'),
];

ReactDOM.render(
    <App shaders={shaders} texts={texts}/>,
    document.querySelector('#app')
);
