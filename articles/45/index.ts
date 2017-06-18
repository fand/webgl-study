declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 45,
    date: 'Sun Jun 18 17:17:38 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
});
