import * as React from 'react';
import { Helmet } from 'react-helmet';

const Layout = ({ title, children }) => (
    <div>
        <Helmet>
            <title>{title !== '' ? `${title} - WebGL Study` : 'WebGL Study'}</title>
        </Helmet>
        <h1><a href="https://fand.github.io/webgl-study">fand/webgl-study</a></h1>
        {children}
    </div>
);

export default Layout;
