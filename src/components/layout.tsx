import * as React from 'react';
import { Helmet } from 'react-helmet';
import Link from './link';

const analytics = `
!function(W,e,b,G,L){W.GoogleAnalyticsObject=b;W[b]||(W[b]=function(){
(W[b].q=W[b].q||[]).push(arguments)});W[b].l=+new Date;G=e.createElement('script');
L=e.scripts[0];G.src='//www.google-analytics.com/analytics.js';
L.parentNode.insertBefore(G,L)}(window,document,'ga');

ga('create', 'UA-41787635-13', 'auto');
ga('send', 'pageview');
`;

const Layout = ({ title, children }) => (
    <div>
        <Helmet>
            <title>{title !== '' ? `${title} - WebGL Study` : 'WebGL Study'}</title>
            <script>{analytics}</script>
        </Helmet>
        <h1><Link to="?">fand/webgl-study</Link></h1>
        {children}
    </div>
);

export default Layout;
