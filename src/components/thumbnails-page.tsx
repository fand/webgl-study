import * as React from 'react';
import Thumbnail from './thumbnail';
import ThreeShader from '../models/three-shader';
import ShaderArticle from '../models/shader-article';
import { throttle } from 'lodash';

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
        this.three.loadShader(article.shader);
        this.three.loadSound(article.sound, true);
        this.three.setCanvas(canvas);
        this.three.play();

        this.setState({
            activeThumbnail: id,
        });
    }, 100);

    render() {
        const dummiesNum = 3 - Math.floor(this.props.articles.length % 3);
        const dummies = (
            dummiesNum === 3 ? [] :
            dummiesNum === 2 ? [1, 2] : [1]
        );

        return (
            <div>
                <div className="thumbnails">
                    {this.props.articles.slice().reverse().map((a, i) =>
                        <Thumbnail
                            key={a.id}
                            thumbnail={`thumbnails/${a.id}.frag.png`}
                            number={a.id}
                            onMouseEnter={this.loadShader}
                            isActive={a.id === this.state.activeThumbnail}
                            />
                    )}
                    {dummies.map(d => <div key={d} className="thumbnail dummy"/>)}
                </div>
            </div>
        );
    }
}
