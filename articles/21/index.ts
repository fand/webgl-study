declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 21,
    date: 'Mon May 15 17:56:33 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
