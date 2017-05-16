import * as React from 'react';
import { throttle } from 'lodash';
import ThreeShader from './three-shader';

interface IThumbnailProps {
    thumbnail: string;
    number: number;
    isActive: boolean;
    onMouseEnter: Function;
}

export default class Thumbnail extends React.Component<IThumbnailProps, {}> {
    public canvas: HTMLElement;

    onMouseMove = throttle(e => {
        this.props.onMouseEnter(this.props.number, this.canvas);
    }, 100);

    setRef = el => { this.canvas = el; }

    render() {
        return (
            <div className="thumbnail"
                onMouseMove={this.onMouseMove}>
                <a href={`?id=${this.props.number}`}>
                    <img src={this.props.thumbnail}/>
                    <canvas ref={this.setRef}
                        style={{
                            opacity: this.props.isActive ? 1 : 0,
                        }}/>
                </a>
            </div>
        );
    }
}
