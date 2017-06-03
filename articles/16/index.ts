declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 16,
    date: 'Fri May 12 17:49:44 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
