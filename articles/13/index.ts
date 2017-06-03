declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 13,
    date: 'Wed May 10 23:48:17 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
