import * as React from 'react';
import Article from './article';

interface IProps {
    shaders: string[];
    texts: string[];
}

export default class App extends React.Component<IProps, {}> {
    render() {
        return (
            <div>
                {this.props.shaders.map((s, i) =>
                    <Article
                        key={s}
                        shader={this.props.shaders[i]}
                        text={this.props.texts[i]}/>
                )}
            </div>
        );
    }
}
