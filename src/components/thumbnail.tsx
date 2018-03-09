import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { throttle } from 'lodash';
import ThreeShader from '../models/three-shader';
import Link from '../components/link';

const ThumbnailLink: any = styled(Link)`
    display: block;
    position: relative;
    background: #000;

    width: 100%;
    height: 100%;

    img {
        pointer-events: none;
        width: 100%;
    }
    canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
`;

interface IThumbnailProps {
    thumbnail: string;
    number: number;
    isActive: boolean;
    onMouseEnter: any;
}

export default class Thumbnail extends React.Component<IThumbnailProps, {}> {
    canvas: HTMLElement;

    static contextTypes = {
        history: PropTypes.any,
    };

    onClick = (e, to) => {
        e.preventDefault();
        e.stopPropagation();
        this.context.history.push(to);
    }

    onMouseMove = () => {
        this.props.onMouseEnter(this.props.number, this.canvas);
    }

    setRef = el => { this.canvas = el; };

    render() {
        return (
            <ThumbnailLink className="thumbnail"
                to={`?id=${this.props.number}`}
                onMouseMove={this.onMouseMove}>
                    <img src={this.props.thumbnail}/>
                    <canvas ref={this.setRef}
                        style={{
                            opacity: this.props.isActive ? 1 : 0,
                        }}/>
            </ThumbnailLink>
        );
    }
}
                // <div>
                // </div>
