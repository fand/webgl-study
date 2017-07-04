import * as React from 'react';
import styled from 'styled-components';
import * as Markdown from 'react-markdown';
import ThreeShader from '../models/three-shader';
import ShaderArticle from '../models/shader-article';
import * as io from 'socket.io-client';
import { isMobile } from '../is-mobile';

const Wrapper = styled.article`
    width: 100%;
    max-width: 720px;

    h2 {
        margin: 0 0 20px;
    }
    .canvas {
        position: relative;
        width: 100%;
        &:before {
            display: block;
            content: '';
            width: 100%;
            padding-bottom: 56.75%;
            @media (max-width: 600px) {
                padding-bottom: 100%;
            }
        }
        canvas, img {
            position: absolute;
            top:0;
            width: 100%;
            height: 100%;
        }
    }

    p {
        line-height: 1.8em;
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

    loadShader = article => {
        this.three = new ThreeShader(1, 1);

        if (this.canvas) {
            this.three.setCanvas(this.canvas);
            this.three.loadTexture(article.texture);
            this.three.loadShader(article.fragment);
            this.three.play();
        }

        if (article.sound) {
            this.three.loadSound(article.sound);
        }
    }

    componentDidMount() {
        if (isMobile) { return; }
        this.loadShader(this.props.article);

        if (process.env.NODE_ENV !== 'production') {
            const socket = io('http://localhost:8081');
            socket.on('reload', ([id, data]) => {
                if (+id === this.props.article.id) {
                    this.three.loadShader(data);
                }
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (isMobile) { return; }
        this.three.stop();
        this.loadShader(nextProps.article);
    }

    componentWillUnmount() {
        if (this.three) {
            this.three.stop();
        }
    }

    setCanvas = el => this.canvas = el;

    render() {
        const { article } = this.props;
        return (
            <Wrapper>
                <h2>{article.title}</h2>
                <div className="canvas">
                    {isMobile ?
                        <img src={`thumbnails/${this.props.article.id}.gif`}/> :
                        <canvas ref={this.setCanvas}/>
                    }
                </div>
                <Markdown source={this.props.article.body}/>
            </Wrapper>
        );
    }
}
