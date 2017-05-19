import * as React from 'react';
import Thumbnail from './thumbnail';
import ArticlePage from './article-page';
import ThumbnailsPage from './thumbnails-page';
import ThreeShader from '../models/three-shader';
import ShaderArticle from '../models/shader-article';

interface IProps {
    articles: ShaderArticle[];
}

interface IState {
    id: number;
}

export default class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const m = location.search.match(/\?id=(\d*)$/);
        this.state = {
            id: m ? +m[1] : null,
        };
    }

    render() {
        if (this.state.id != null) {
            return <ArticlePage article={this.props.articles[this.state.id]}/>
        }

        return <ThumbnailsPage articles={this.props.articles}/>;
    }
}
