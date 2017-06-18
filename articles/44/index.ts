declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 44,
    date: 'Sun Jun 18 15:37:40 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
