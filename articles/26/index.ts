declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 26,
    date: 'Fri May 19 00:20:11 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
