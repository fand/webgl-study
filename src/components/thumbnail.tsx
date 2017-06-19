import * as React from 'react';
import { throttle } from 'lodash';
import ThreeShader from '../models/three-shader';
import Link from '../components/link';

interface IThumbnailProps {
    thumbnail: string;
    number: number;
    isActive: boolean;
    onMouseEnter: any;
}

export default class Thumbnail extends React.Component<IThumbnailProps, {}> {
    canvas: HTMLElement;

    onMouseMove = () => {
        this.props.onMouseEnter(this.props.number, this.canvas);
    }

    setRef = el => { this.canvas = el; };

    render() {
        return (
            <Link className="thumbnail"
                to={`?id=${this.props.number}`}
                onMouseMove={this.onMouseMove}>
                <div>
                    <img src={this.props.thumbnail}/>
                    <canvas ref={this.setRef}
                        style={{
                            opacity: this.props.isActive ? 1 : 0,
                        }}/>
                </div>
            </Link>
        );
    }
}
