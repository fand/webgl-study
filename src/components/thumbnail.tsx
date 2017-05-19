import * as React from 'react';
import { throttle } from 'lodash';
import ThreeShader from '../models/three-shader';
import * as VisibilitySensor from 'react-visibility-sensor';
import Link from '../components/link';

interface IThumbnailProps {
    thumbnail: string;
    number: number;
    isActive: boolean;
    onMouseEnter: Function;
}
interface IThumbnailState {
    isVisible: boolean;
}

const Sensor = ({ isMobile, children, onChange }) => {
    if (isMobile) {
        return <VisibilitySensor onChange={onChange} partialVisibility={false} children={children}/>
    }
    else {
        return children;
    }
};

export default class Thumbnail extends React.Component<IThumbnailProps, IThumbnailState> {
    public canvas: HTMLElement;

    public state = {
        isVisible: false,
    };

    onMouseMove = throttle(e => {
        this.props.onMouseEnter(this.props.number, this.canvas);
    }, 200);

    setRef = el => { this.canvas = el; }

    onEnter = isVisible => {
        if (isVisible === this.state.isVisible) {
            return;
        }
        if (isVisible) {
            this.onMouseMove();
        }
        this.setState({ isVisible });
    }

    render() {
        return (
            <Link className="thumbnail"
                to={`?id=${this.props.number}`}
                onMouseMove={this.onMouseMove}>
                <Sensor onChange={this.onEnter} isMobile={window.innerWidth < 600}>
                    <div>
                        <img src={this.props.thumbnail}/>
                        <canvas ref={this.setRef}
                            style={{
                                opacity: this.props.isActive ? 1 : 0,
                            }}/>
                    </div>
                </Sensor>
            </Link>
        );
    }
}
