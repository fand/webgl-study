declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 29,
    date: 'Wed May 24 00:44:51 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
