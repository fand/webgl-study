import * as React from 'react';
import { Helmet } from 'react-helmet';
import Link from './link';

const Layout = ({ title, children }) => (
    <div>
        <Helmet>
            <title>{title !== '' ? `${title} - WebGL Study` : 'WebGL Study'}</title>
        </Helmet>
        <h1><Link to="?">fand/webgl-study</Link></h1>
        {children}
    </div>
);

export default Layout;
