declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle({
    id: 40,
    date: 'Sat Jun 10 14:00:16 2017 +0900',
    text: require('./README.md'),
    fragment: require('./index.frag'),
    categories: ['raymarching'],
});