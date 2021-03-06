import * as React from 'react';
import styled from 'styled-components';
import Thumbnail from './thumbnail';
import ThreeShader from '../models/three-shader';
import ShaderArticle from '../models/shader-article';
import { throttle, range } from 'lodash';

const Thumbnails = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    position: relative;
    margin-top: -5px;
`;
const ThumbnailsHeader = styled.div`
    display: block;
    flex: 100%;
    margin: 1%;
`;
const ThumbnailWrapper = styled.div`
    position: relative;
    flex: 1 0 210px;
    min-width: 150px;
    margin: 1%;
    background: #000;
    &:before {
        position: absolute;
        content: '';
        width: 100%;
        padding-bottom: 100%;
    }
    @media (max-width: 600px) {
        min-width: 93%;
        margin-bottom: 10px;
    }
`;
const Dummy = (ThumbnailWrapper as any).extend`
    background: none;
    &:before {
        padding-bottom: 0;
    }
`;

interface IThumbnailsProps {
    articles: ShaderArticle[];
    category: string;
}

interface IThumbnailsState {
    activeThumbnail: number;
}

export default class App extends React.Component<IThumbnailsProps, IThumbnailsState> {
    private three: ThreeShader;
    private canvas: HTMLCanvasElement;

    constructor(props: IThumbnailsProps) {
        super(props);
        this.three = null;
        this.state = {
            activeThumbnail: null,
        };
    }

    componentDidMount() {
        this.three = new ThreeShader(1.5, 3);
    }

    componentWillUnmount() {
        this.three.stop();
    }

    loadShader = throttle((id, canvas) => {
        if (!this.three) { return; }
        if (!canvas) {
            this.three.stop();
            return;
        }
        if (this.three.canvas === canvas) {
            return;
        }

        this.three.stop();
        const article = this.props.articles[id];
        this.three.loadShader(article.fragment);
        this.three.loadTexture(article.texture);
        this.three.loadSound(article.sound, true);
        this.three.setCanvas(canvas);
        this.three.play();

        this.setState({
            activeThumbnail: id,
        });
    }, 100);

    render() {
        const articles = this.props.articles
            .filter(a => a.categories.some(c => !!c.match(this.props.category)))
            .reverse();

        const dummiesNum = 5 - Math.floor(articles.length % 5);
        const dummies = dummiesNum === 5 ? [] : range(dummiesNum);
        return (
            <Thumbnails>
                {[this.props.category].filter(x => x).map(c =>
                    <ThumbnailsHeader key={c}><h2>Category: {c} ({articles.length})</h2></ThumbnailsHeader>
                )}
                {articles.map(a =>
                    <ThumbnailWrapper key={a.id}>
                        <Thumbnail
                            thumbnail={`thumbnails/${a.id}.png`}
                            number={a.id}
                            onMouseEnter={this.loadShader}
                            isActive={a.id === this.state.activeThumbnail}
                            />
                    </ThumbnailWrapper>
                )}
                {dummies.map(d => <Dummy key={d}/>)}
            </Thumbnails>
        );
    }
}
