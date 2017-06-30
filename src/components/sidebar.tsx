import * as React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { sortedUniq, flatten } from 'lodash';
import Link from './link';

const Wrapper = styled.nav`
    a {
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
    h1 {
        font-size: 1.2em;
        margin: 0 0 20px;
        text-align: left;
        @media (max-width: 600px) {
            display: none;
        }
    }
    ul {
        padding-left: 0;
        li {
            margin-bottom: 5px;
            white-space: nowrap;
        }
    }
    section {
        margin: 20px 0 30px;
    }
`;
const Footer = styled.div`
    .fa {
        color: #999;
        font-size: 1.4em;
        margin-right: 4px;
        @media (max-width: 600px) {
            font-size: 2em;
            margin-right: 12px;
        }
    }
`;

export default class Sidebar extends React.Component<any, any> {
    render() {
        const recentEntries = this.props.articles.slice(-3).reverse();
        const categories = sortedUniq(flatten(this.props.articles.map(a => a.categories)));
        return (
            <Wrapper>
                <h1><Link to="?">fand/webgl-study</Link></h1>

                <section>
                    <h2>Recent entries</h2>
                    <ul>
                        {recentEntries.map(a => (
                            <li key={a.id}><Link to={`?id=${a.id}`}>{a.title}</Link></li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>Categories</h2>
                    <ul>
                        {categories.map(c => (
                            <li key={c}><Link to={`?category=${c}`}>{c}</Link></li>
                        ))}
                    </ul>
                </section>

                <Footer>
                    <a href="https://fand.github.io/webgl-study/feed.xml" target="_blank">
                        <i className="fa fa-rss-square" aria-hidden="true"></i>
                    </a>
                    <a href="https://twitter.com/amagitakayosi" target="_blank">
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a href="https://github.com/fand/webgl-study" target="_blank">
                        <i className="fa fa-github" aria-hidden="true"></i>
                    </a>
                </Footer>
            </Wrapper>
        );
    }
};
