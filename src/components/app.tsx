import * as React from 'react';
import * as PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';
import Layout from './layout';
import ArticlePage from './article-page';
import ThumbnailsPage from './thumbnails-page';
import ShaderArticle from '../models/shader-article';

interface IProps {
    articles: ShaderArticle[];
}

interface IState {
    id: number;
}

export default class App extends React.Component<IProps, IState> {

    static childContextTypes = {
        history: PropTypes.any,
    };

    private history: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            id: this.getId(),
        };

        this.history = createHistory();
        this.history.listen(location => {
            this.setState({ id: this.getId() });
        });
    }

    getId(): number {
        const m = location.search.match(/\?id=(\d*)$/);
        if (!m) { return null; }

        const id = m[1];
        const article = this.props.articles[id];

        if (!article) { return null; }

        return +id;
    }

    getChildContext() {
        return { history: this.history };
    }

    renderContents() {
        if (this.state.id != null) {
            return <ArticlePage article={this.props.articles[this.state.id]}/>;
        }
        return <ThumbnailsPage articles={this.props.articles}/>;
    }

    render() {
        const article = this.props.articles[this.state.id];
        const title = article ? article.text.split('\n')[0].split('## ')[1] : '';

        return (
            <Layout title={title} articles={this.props.articles}>
                {this.renderContents()}
            </Layout>
        );
    }
}
