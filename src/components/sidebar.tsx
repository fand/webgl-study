import * as React from 'react';
import { Helmet } from 'react-helmet';
import Link from './link';

export default class Sidebar extends React.Component<any, any> {
    render() {
        return (
            <nav className="sidebar">
                <h2><Link to="?">fand/webgl-study</Link></h2>

                <h2>Categories</h2>
                <ul>
                    <li><Link to="?category=Raytracing">Raytracing</Link></li>
                    <li><Link to="?category=Audio">Audio</Link></li>
                </ul>
            </nav>
        );
    }
};
