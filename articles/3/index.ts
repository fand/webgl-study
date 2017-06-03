declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 3,
    date: 'Wed May 3 17:29:58 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
