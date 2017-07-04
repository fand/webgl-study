import * as React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Link from './link';
import Sidebar from './sidebar';
import MobileHeader from './mobile-header';

const analytics = `
!function(W,e,b,G,L){W.GoogleAnalyticsObject=b;W[b]||(W[b]=function(){
(W[b].q=W[b].q||[]).push(arguments)});W[b].l=+new Date;G=e.createElement('script');
L=e.scripts[0];G.src='//www.google-analytics.com/analytics.js';
L.parentNode.insertBefore(G,L)}(window,document,'ga');

ga('create', 'UA-41787635-13', 'auto');
ga('send', 'pageview');
`;

const Wrapper = styled.div``;
const SidebarWrapper: any = styled.div`
    position: fixed;
    width: 320px;
    height: 100%;
    padding: 30px;
    box-sizing: border-box;
    transition: 300ms;
    z-index: 2;
    background: white;

    @media (max-width: 600px) {
        width: 100%;
        margin: 0;
        ${(p: any) => p.isMenuOpen ? `
            height: 100%;
            overflow: auto;
            padding-top: 100px;
        ` : `
            height: 0;
            overflow: hidden;
        `};
    }
`;
const ContentWrapper = styled.div`
    position: absolute;
    width: calc(100% - 320px);
    max-width: 1280px;
    padding: 30px 0;
    box-sizing: border-box;
    left: 320px;
    @media (max-width: 600px) {
        left: 0;
        top: 90px;
        width: 100%;
        padding: 0 10px;
    }
`;

const HeaderWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 84px;
    background: white;
    text-align: center;
    z-index: 3;

    display: none;
    @media (max-width: 600px) {
        display: block;
    }
`;

const getTitle = title => {
    return title !== '' ? `${title} - WebGL Study` : 'WebGL Study';
};

export default class Layout extends React.Component<any, any> {
    render() {
        const { title, articles, children } = this.props;
        return (
            <Wrapper>
                <Helmet>
                    <title>{getTitle(title)}</title>
                    <script>{analytics}</script>
                </Helmet>
                <SidebarWrapper isMenuOpen={this.props.isMenuOpen}>
                    <Sidebar articles={articles}/>
                </SidebarWrapper>
                <HeaderWrapper>
                    <MobileHeader
                        title={'WebGL Study'}
                        isMenuOpen={this.props.isMenuOpen}
                        toggle={this.props.toggleMenu}/>
                </HeaderWrapper>
                <ContentWrapper>
                    {children}
                </ContentWrapper>
            </Wrapper>
        );
    }
}
