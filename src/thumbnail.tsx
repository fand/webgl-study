import * as React from 'react';
import ThreeShader from './three-shader';

interface IThumbnailProps {
    thumbnail: string;
    number: number;
    isActive: boolean;
    onMouseEnter: Function;
}

export default class Thumbnail extends React.Component<IThumbnailProps, {}> {
    public canvas: HTMLElement;

    onMouseEnter = e => {
        this.props.onMouseEnter(this.props.number, this.canvas);
    }

    setRef = el => { this.canvas = el; }

    render() {
        return (
            <div className="thumbnail"
                onMouseEnter={this.onMouseEnter}>
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
