declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 39,
    date: 'Sat Jun 10 10:01:18 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
    categories: ['raymarching'],
});
