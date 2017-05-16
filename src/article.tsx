import * as React from 'react';
import * as Markdown from 'react-markdown';
import ThreeShader from './three-shader';

interface IArticleProps {
    shader: string;
    text: string;
}

export default class Article extends React.Component<IArticleProps, {}> {
    private canvas: HTMLCanvasElement;
    private three: ThreeShader;

    constructor(props: IArticleProps) {
        super(props);
        this.canvas = null;
        this.three = null;
    }

    componentDidMount () {
        this.three = new ThreeShader(1, 1);
        this.three.loadShader(this.props.shader);
        if (this.canvas) {
            this.three.setCanvas(this.canvas);
        }
    }

    setCanvas = el => this.canvas = el;

    render() {
        return (
            <article className="wrapper">
                <div className="left">
                    <Markdown source={this.props.text}/>
                </div>
                <div className="right">
                    <canvas ref={this.setCanvas} className="canvas"/>
                </div>
            </article>
        );
    }
}
