declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 28,
    date: 'Mon May 22 21:52:29 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
