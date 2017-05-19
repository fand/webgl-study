import * as React from 'react';
import Thumbnail from './thumbnail';
import ThreeShader from '../models/three-shader';
import ShaderArticle from '../models/shader-article';

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

    loadShader = (id, canvas) => {
        if (this.three && this.three.canvas !== canvas) {
            this.three.loadShader(this.props.articles[id].shader);
            this.three.setCanvas(canvas);
        }
        this.setState({
            activeThumbnail: id,
        });
    }

    render() {
        const dummiesNum = 3 - Math.floor(this.props.articles.length % 3);
        const dummies = (
            dummiesNum === 3 ? [] :
            dummiesNum === 2 ? [1, 2]: [1]
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
