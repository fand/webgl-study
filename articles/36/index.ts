declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 36,
    date: 'Sun Jun 4 12:30:54 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
    categories: ['raymarching'],
});
