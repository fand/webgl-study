import * as React from 'react';
import ThreeShader from './three-shader';
import Thumbnail from './thumbnail';

interface IProps {
    shaders: string[];
    texts: string[];
}

interface IState {
    activeThumbnail: number;
}

export default class App extends React.Component<IProps, IState> {
    private three: ThreeShader;
    private canvas: HTMLCanvasElement;

    constructor(props: IProps) {
        super(props);
        this.three = null;
        this.state = {
            activeThumbnail: null,
        };
    }

    componentDidMount() {
        this.three = new ThreeShader();
    }

    loadShader = (i, canvas) => {
        if (this.three) {
            this.three.loadShader(this.props.shaders[i]);
            this.three.setCanvas(canvas);
        }
        this.setState({
            activeThumbnail: i,
        });
    }

    render() {
        return (
            <div>
                <div className="thumbnails">
                    {this.props.shaders.map((s, i) =>
                        <Thumbnail
                            key={s}
                            thumbnail="thumbnails/out.png"
                            number={i}
                            onMouseEnter={this.loadShader}
                            isActive={i === this.state.activeThumbnail}
                            />
                    )}
                </div>
            </div>
        );
    }
}
