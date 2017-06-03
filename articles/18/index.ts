declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 18,
    date: 'Sat May 13 02:23:19 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
