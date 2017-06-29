import * as React from 'react';
import styled from 'styled-components';
import * as Markdown from 'react-markdown';
import ThreeShader from '../models/three-shader';
import ShaderArticle from '../models/shader-article';
import * as io from 'socket.io-client';
import { isMobile } from '../is-mobile';

const Wrapper = styled.article`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    margin: 10% auto 20%;
    max-width: 1280px;
`
const Left = styled.div`
    flex: 1 0 240px;
    margin: 0 20px;
    position: relative;
`;
const Right = styled.div`
    flex: 1 0 240px;
    margin: 0 20px;
    position: relative;

    &:before {
        display: block;
        content: '';
        padding-bottom: 100%;
    }
    .canvas, img {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }
`;

interface IArticleProps {
    article: ShaderArticle;
}

export default class Article extends React.Component<IArticleProps, {}> {
    private canvas: HTMLCanvasElement;
    private three: ThreeShader;
    private audio: AudioContext;
    private analyser: AnalyserNode;
    private source: AudioBufferSourceNode;

    constructor(props: IArticleProps) {
        super(props);
        this.canvas = null;
        this.three = null;
    }

    componentDidMount() {
        if (isMobile) { return; }

        this.three = new ThreeShader(1, 1);

        if (this.canvas) {
            this.three.setCanvas(this.canvas);
            this.three.loadTexture(this.props.article.texture);
            this.three.loadShader(this.props.article.fragment);
            this.three.play();
        }

        if (this.props.article.sound) {
            this.three.loadSound(this.props.article.sound);
        }

        if (process.env.NODE_ENV !== 'production') {
            const socket = io('http://localhost:8081');
            socket.on('reload', ([id, data]) => {
                if (+id === this.props.article.id) {
                    this.three.loadShader(data);
                }
            });
        }
    }

    componentWillUnmount() {
        this.three.stop();
    }

    setCanvas = el => this.canvas = el;

    render() {
        return (
            <Wrapper>
                <Left>
                    <Markdown source={this.props.article.text}/>
                </Left>
                <Right>
                    {isMobile ?
                        <img src={`thumbnails/${this.props.article.id}.gif`}/> :
                        <canvas ref={this.setCanvas} className="canvas"/>
                    }
                </Right>
            </Wrapper>
        );
    }
}
