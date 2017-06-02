import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/app';
import articles from '../articles';

ReactDOM.render(
    <App articles={articles}/>,
    document.querySelector('#app')
);
