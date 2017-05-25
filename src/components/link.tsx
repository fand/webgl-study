import * as React from 'react';
import * as PropTypes from 'prop-types';

interface IProps extends React.Props<Link> {
    to: string;
}

export default class Link extends React.Component<any, {}> {
    static contextTypes = {
        history: PropTypes.any,
    };

    onClick = e => {
        e.preventDefault();
        e.stopPropagation();
        this.context.history.push(this.props.to);
    }

    render() {
        const remains: any = this.props;
        return (
            <a href={this.props.to} onClick={this.onClick} {...remains}>
                {this.props.children}
            </a>
        );
    }
}
