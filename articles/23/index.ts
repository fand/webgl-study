declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 23,
    date: 'Wed May 17 23:54:50 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
