import * as React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Link from './link';
import Sidebar from './sidebar';

const analytics = `
!function(W,e,b,G,L){W.GoogleAnalyticsObject=b;W[b]||(W[b]=function(){
(W[b].q=W[b].q||[]).push(arguments)});W[b].l=+new Date;G=e.createElement('script');
L=e.scripts[0];G.src='//www.google-analytics.com/analytics.js';
L.parentNode.insertBefore(G,L)}(window,document,'ga');

ga('create', 'UA-41787635-13', 'auto');
ga('send', 'pageview');
`;

const Wrapper = styled.div``;
const SidebarWrapper = styled.div`
    position: fixed;
    width: 360px;
    margin: 40px;
    @media (max-width: 600px) {
        display: none;
    }
`;
const ContentWrapper = styled.div`
    position: absolute;
    max-width: 1280px;
    left: 240px;
    @media (max-width: 600px) {
        left: 0;
    }
`;

const getTitle = (title) => {
    return title !== '' ? `${title} - WebGL Study` : 'WebGL Study';
};

const Layout = ({ title, children }) => (
    <Wrapper>
        <Helmet>
            <title>{getTitle(title)}</title>
            <script>{analytics}</script>
        </Helmet>
        <SidebarWrapper>
            <Sidebar/>
        </SidebarWrapper>
        <ContentWrapper>
            {children}
        </ContentWrapper>
    </Wrapper>
);

export default Layout;
