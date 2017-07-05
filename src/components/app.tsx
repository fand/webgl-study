import * as React from 'react';
import * as PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';
import * as qs from 'query-string';
import Layout from './layout';
import ArticlePage from './article-page';
import ThumbnailsPage from './thumbnails-page';
import ShaderArticle from '../models/shader-article';
import jump from 'jump.js';

interface IProps {
    articles: ShaderArticle[];
}

interface IState {
    id: number;
    category: string;
    isMenuOpen: boolean;
}

export default class App extends React.Component<IProps, IState> {

    static childContextTypes = {
        history: PropTypes.any,
    };

    private history: any;

    constructor(props: IProps) {
        super(props);

        this.state = this.getState();

        this.history = createHistory();
        this.history.listen(location => {
            this.setState(this.getState);
            jump('#app', { duration: 500 });
        });
    }

    toggleMenu = isMenuOpen => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    getState(): any {
        const newState = { ...this.state };
        const parsed = qs.parse(location.search);

        const article = this.props.articles[+parsed.id];
        newState.id = article ? article.id : null;
        newState.category = parsed.category;

        newState.isMenuOpen = false;

        return newState;
    }

    getChildContext() {
        return { history: this.history };
    }

    renderContents() {
        if (this.state.id != null) {
            return <ArticlePage article={this.props.articles[this.state.id]}/>;
        }
        return (
            <ThumbnailsPage
                articles={this.props.articles}
                category={this.state.category}/>
        );
    }

    render() {
        const article = this.props.articles[this.state.id];
        const title = article ? article.text.split('\n')[0].split('## ')[1] : '';

        return (
            <Layout title={title} articles={this.props.articles}
              isMenuOpen={this.state.isMenuOpen}
              toggleMenu={this.toggleMenu}>
                {this.renderContents()}
            </Layout>
        );
    }
}
