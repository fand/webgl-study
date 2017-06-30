import * as React from 'react';
import styled from 'styled-components';
import Link from './link';

const Header = styled.header`
`;
const Title = styled.h1`
    font-size: 1.6em;
    text-align: center;
    margin: 20px 0;
`;

export default ({ title }) => (
    <Header>
        <Title>{title}</Title>
    </Header>
);
