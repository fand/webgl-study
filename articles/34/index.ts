declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 34,
    date: 'Sat Jun 3 12:23:05 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
