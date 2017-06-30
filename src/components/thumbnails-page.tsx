import * as React from 'react';
import styled from 'styled-components';
import Thumbnail from './thumbnail';
import ThreeShader from '../models/three-shader';
import ShaderArticle from '../models/shader-article';
import { throttle } from 'lodash';

const Thumbnails = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    position: relative;
    margin-top: -5px;
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
        const dummiesNum = 5 - Math.floor(this.props.articles.length % 5);
        const dummies = (
            dummiesNum === 5 ? [] :
            dummiesNum === 4 ? [1, 2, 3, 4] :
            dummiesNum === 3 ? [1, 2, 3] :
            dummiesNum === 2 ? [1, 2] : [1]
        );

        return (
            <Thumbnails>
                {this.props.articles.slice().reverse().map((a, i) =>
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
