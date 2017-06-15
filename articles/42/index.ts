declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 42,
    date: 'Thu Jun 15 15:15:13 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
    categories: ['raymarching'],
});
