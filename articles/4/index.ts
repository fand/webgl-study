declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 4,
    date: 'Wed May 3 18:48:40 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
