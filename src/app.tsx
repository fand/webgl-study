import * as React from 'react';
import ThreeShader from './three-shader';
import Thumbnail from './thumbnail';
import Article from './article';

interface IProps {
    shaders: string[];
    texts: string[];
}

interface IState {
    activeThumbnail: number;
    id: number;
}

export default class App extends React.Component<IProps, IState> {
    private three: ThreeShader;
    private canvas: HTMLCanvasElement;

    constructor(props: IProps) {
        super(props);
        this.three = null;
        const m = location.search.match(/\?id=(\d*)$/);
        this.state = {
            activeThumbnail: null,
            id: m ? +m[1] : null,
        };
    }

    componentDidMount() {
        this.three = new ThreeShader(1.5, 3);
    }

    loadShader = (id, canvas) => {
        const i = this.props.shaders.length - id - 1;
        if (this.three && this.three.canvas !== canvas) {
            this.three.loadShader(this.props.shaders[i]);
            this.three.setCanvas(canvas);
        }
        this.setState({
            activeThumbnail: i,
        });
    }

    renderArticle(id) {
        const i = this.props.shaders.length - id - 1 ;
        return (
            <Article shader={this.props.shaders[i]} text={this.props.texts[i]}/>
        );
    }

    render() {
        if (this.state.id != null) {
            return this.renderArticle(this.state.id);
        }

        const dummiesNum = 3 - Math.floor(this.props.shaders.length % 3);
        const dummies = (
            dummiesNum === 3 ? [] :
            dummiesNum === 2 ? [1, 2]: [1]
        );

        return (
            <div>
                <div className="thumbnails">
                    {this.props.shaders.map((s, i) =>
                        <Thumbnail
                            key={s}
                            thumbnail={`thumbnails/${this.props.shaders.length - i - 1}.frag.png`}
                            number={this.props.shaders.length - i - 1}
                            onMouseEnter={this.loadShader}
                            isActive={i === this.state.activeThumbnail}
                            />
                    )}
                    {dummies.map(d => <div key={d} className="thumbnail dummy"/>)}
                </div>
            </div>
        );
    }
}
