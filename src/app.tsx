import * as React from 'react';
import * as Markdown from 'react-markdown';
import * as inView from 'in-view';
import * as Sensor from 'react-visibility-sensor';

import ThreeShader from './three-shader';

interface IProps {
    shaders: string[];
    texts: string[];
}

export default class App extends React.Component<IProps, {}> {
    private el: any[];
    private threes: ThreeShader[];
    private renderArticle: any;
    private onEnterOrLeave: any;

    static inited = false;
    static initInView () {
        if (App.inited) { return; }
        App.inited = true;
    }

    constructor(props: IProps) {
        super(props);
        this.el = [];
        this.threes = [];

        App.initInView();

        this.onEnterOrLeave = i => isVisible => {
            setTimeout(() => {
                this.threes[i].toggle(isVisible);
            }, 10);
        };

        this.renderArticle = (s, i) => (
            <article key={s} className="wrapper">
                <Sensor partialVisibility={true} onChange={this.onEnterOrLeave(i)}/>
                <div className="left">
                    <Markdown source={this.props.texts[i]}/>
                </div>
                <div className="right">
                    <div ref={el => { this.el[i] = el; }} className="canvas"></div>
                </div>
            </article>
        );
    }

    componentDidMount() {
        this.el.forEach((el, i) => {
            this.threes[i] = new ThreeShader(
                el,
                this.props.shaders[i]
            );
        });
    }

    render() {
        return (
            <div>
                {this.props.shaders.map(this.renderArticle)}
            </div>
        );
    }
}
