import * as React from 'react';
import styled from 'styled-components';
import Link from './link';

const Header = styled.header`
    h1 {
        font-size: 1.6em;
        text-align: center;
        margin: 20px 0;
    }

    .hamburger {
        position: absolute;
        right: 12px;
        top: 12px;
        cursor: pointer;
        opacity: 0.3;
        transform: scale(0.8);

        &:hover {
            opacity: 0.7;
        }
    }
`;

export default ({ title, isMenuOpen, toggle }) => (
    <Header>
        <h1><Link to="?">{title}</Link></h1>
        <div className={`hamburger hamburger--spring ${isMenuOpen ? 'is-active' : ''}`}
            onClick={toggle}>
            <div className="hamburger-box">
                <div className="hamburger-inner"></div>
            </div>
        </div>
    </Header>
);
