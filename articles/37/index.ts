declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 37,
    date: 'Wed Jun 7 23:20:49 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
