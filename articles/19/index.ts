declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 19,
    date: 'Sat May 13 06:02:49 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
