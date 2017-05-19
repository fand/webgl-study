import * as React from 'react';
import * as Markdown from 'react-markdown';
import ThreeShader from '../models/three-shader';
import ShaderArticle from '../models/shader-article';

interface IArticleProps {
    article: ShaderArticle;
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

        if (this.canvas) {
            this.three.setCanvas(this.canvas);
            this.three.loadShader(this.props.article.shader);
            this.three.play();
        }
    }

    componentWillUnmount() {
        this.three.stop();
    }

    setCanvas = el => this.canvas = el;

    render() {
        return (
            <article className="wrapper">
                <div className="left">
                    <Markdown source={this.props.article.text}/>
                </div>
                <div className="right">
                    <canvas ref={this.setCanvas} className="canvas"/>
                </div>
            </article>
        );
    }
}
