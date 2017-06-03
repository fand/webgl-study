declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 27,
    date: 'Fri May 19 21:12:14 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
