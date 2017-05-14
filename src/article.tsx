import * as React from 'react';
import * as Markdown from 'react-markdown';
import * as Sensor from 'react-visibility-sensor';

import ThreeShader from './three-shader';

interface IArticleProps {
    shader: string;
    text: string;
}

export default class Article extends React.Component<IArticleProps, {}> {
    private el: any;
    private three: ThreeShader;

    constructor(props: IArticleProps) {
        super(props);
        this.el = null;
        this.three = null;
    }

    onEnterOrLeave = isVisible => {
        if (isVisible) {
            setTimeout(() => this.onEnter(), 10);
        }
        else {
            this.onLeave();
        }
    };

    onEnter = () => {
        this.three = new ThreeShader(this.el, this.props.shader);
        this.three.toggle(true);
    }

    onLeave = () => {
        this.three = null;
        if (this.el != null) {
            this.el.innerHTML = "";
        }
    }

    render() {
        return (
            <article className="wrapper">
                <Sensor partialVisibility={true}
                    onChange={this.onEnterOrLeave}/>

                <div className="left">
                    <Markdown source={this.props.text}/>
                </div>
                <div className="right">
                    <div ref={el => { this.el = el; }} className="canvas"></div>
                </div>
            </article>
        );
    }
}
