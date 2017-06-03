declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 20,
    date: 'Sat May 13 13:48:22 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
