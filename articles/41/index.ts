declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 41,
    date: 'Mon Jun 12 23:31:25 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
    categories: ['raymarching'],
});
