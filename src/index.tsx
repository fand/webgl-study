import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/app';

declare function require(name: string);

const articles = [
    require('../articles/0').default,
    require('../articles/1').default,
    require('../articles/2').default,
    require('../articles/3').default,
    require('../articles/4').default,
    require('../articles/5').default,
    require('../articles/6').default,
    require('../articles/7').default,
    require('../articles/8').default,
    require('../articles/9').default,
    require('../articles/10').default,
    require('../articles/11').default,
    require('../articles/12').default,
    require('../articles/13').default,
    require('../articles/14').default,
    require('../articles/15').default,
    require('../articles/16').default,
    require('../articles/17').default,
    require('../articles/18').default,
    require('../articles/19').default,
    require('../articles/20').default,
    require('../articles/21').default,
    require('../articles/22').default,
    require('../articles/23').default,
    require('../articles/24').default,
    require('../articles/25').default,
    require('../articles/26').default,
    require('../articles/27').default,
];

ReactDOM.render(
    <App articles={articles}/>,
    document.querySelector('#app')
);
